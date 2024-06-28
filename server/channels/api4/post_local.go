// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package api4

import (
	"net/http"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/v8/channels/app"
	"github.com/mattermost/mattermost/server/v8/channels/audit"
)

func (api *API) InitPostLocal() {
	api.BaseRoutes.Post.Handle("", api.APILocal(getPost)).Methods("GET")
	api.BaseRoutes.Post.Handle("", api.APILocal(localDeletePost)).Methods("DELETE")

	api.BaseRoutes.PostsForChannel.Handle("", api.APILocal(getPostsForChannel)).Methods("GET")
}

func localDeletePost(c *Context, w http.ResponseWriter, r *http.Request) {
	c.RequirePostId()
	if c.Err != nil {
		return
	}

	permanent := c.Params.Permanent

	auditRec := c.MakeAuditRecord("localDeletePost", audit.Fail)
	defer c.LogAuditRecWithLevel(auditRec, app.LevelContent)
	audit.AddEventParameter(auditRec, "post_id", c.Params.PostId)
	audit.AddEventParameter(auditRec, "permanent", permanent)

	includeDeleted := false
	if permanent {
		includeDeleted = true
	}

	post, err := c.App.GetSinglePost(c.AppContext, c.Params.PostId, includeDeleted)
	if err != nil {
		c.SetPermissionError(model.PermissionDeletePost)
		return
	}
	auditRec.AddEventPriorState(post)
	auditRec.AddEventObjectType("post")

	if permanent {
		err = c.App.PermanentDeletePost(c.AppContext, c.Params.PostId, c.AppContext.Session().UserId)
	} else {
		_, err = c.App.DeletePost(c.AppContext, c.Params.PostId, c.AppContext.Session().UserId)
	}

	if err != nil {
		c.Err = err
		return
	}

	auditRec.Success()
	ReturnStatusOK(w)
}
