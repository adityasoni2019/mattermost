// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import '@testing-library/jest-dom';

import React from 'react';
import type {IntlShape} from 'react-intl';
import type {RouteComponentProps} from 'react-router-dom';

import type {UserProfile} from '@mattermost/types/users';

import SystemUserDetail, {getUserAuthenticationTextField} from 'components/admin_console/system_user_detail/system_user_detail';
import type {Params, Props} from 'components/admin_console/system_user_detail/system_user_detail';

import type {MockIntl} from 'tests/helpers/intl-test-helper';
import {renderWithContext} from 'tests/react_testing_utils';

describe('SystemUserDetail', () => {
    const defaultProps: Props = {
        showManageUserSettings: false,
        showLockedManageUserSettings: false,
        mfaEnabled: false,
        patchUser: jest.fn(),
        updateUserMfa: jest.fn(),
        getUser: jest.fn(),
        updateUserActive: jest.fn(),
        setNavigationBlocked: jest.fn(),
        addUserToTeam: jest.fn(),
        openModal: jest.fn(),
        getUserPreferences: jest.fn(),
        intl: {
            formatMessage: jest.fn(),
        } as MockIntl,
        ...({
            match: {
                params: {
                    user_id: 'user_id',
                },
            },
        } as RouteComponentProps<Params>),
    };

    test('should match default snapshot', () => {
        const props = defaultProps;
        const {container} = renderWithContext(<SystemUserDetail {...props}/>);
        expect(container).toMatchSnapshot();
    });

    test('should match snapshot if MFA is enabled', () => {
        const props = {
            ...defaultProps,
            mfaEnabled: true,
        };
        const {container} = renderWithContext(<SystemUserDetail {...props}/>);
        expect(container).toMatchSnapshot();
    });

    test('should show manage user settings button as activated', () => {
        const props = {
            ...defaultProps,
            showManageUserSettings: true,
        };
        const {container} = renderWithContext(<SystemUserDetail {...props}/>);
        expect(container).toMatchSnapshot();
    });

    test('should show manage user settings button as disabled when no license', () => {
        const props = {
            ...defaultProps,
            showLockedManageUserSettings: false,
        };
        const {container} = renderWithContext(<SystemUserDetail {...props}/>);
        expect(container).toMatchSnapshot();
    });

    test('should not show manage user settings button when user doesn\'t have permission', () => {
        const props = {
            ...defaultProps,
            showManageUserSettings: false,
        };
        const {container} = renderWithContext(<SystemUserDetail {...props}/>);
        expect(container).toMatchSnapshot();
    });
});

describe('getUserAuthenticationTextField', () => {
    const intl = {formatMessage: ({defaultMessage}: {defaultMessage: string}) => defaultMessage} as IntlShape;

    it('should return empty string if user is not provided', () => {
        const result = getUserAuthenticationTextField(intl, false, undefined);
        expect(result).toEqual('');
    });

    it('should return email if user has no auth service and MFA is not enabled', () => {
        const result = getUserAuthenticationTextField(intl, false, {auth_service: '', mfa_active: false} as UserProfile);
        expect(result).toEqual('Email');
    });

    it('should return auth service in uppercase if it is LDAP or SAML', () => {
        const result = getUserAuthenticationTextField(intl, false, {auth_service: 'ldap', mfa_active: false} as UserProfile);
        expect(result).toEqual('LDAP');
    });

    it('should return auth service in title case if it is not LDAP or SAML', () => {
        const result = getUserAuthenticationTextField(intl, true, {auth_service: 'oauth', mfa_active: false} as UserProfile);
        expect(result).toEqual('Oauth');
    });

    it('should include MFA if user has MFA enabled', () => {
        const result = getUserAuthenticationTextField(intl, true, {auth_service: 'oauth', mfa_active: true} as UserProfile);
        expect(result).toEqual('Oauth, MFA');
    });
});
