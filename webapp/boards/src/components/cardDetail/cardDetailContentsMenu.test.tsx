// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {render, screen} from '@testing-library/react'
import React, {ReactElement, ReactNode} from 'react'
import {Provider as ReduxProvider} from 'react-redux'

import userEvent from '@testing-library/user-event'

import {wrapIntl, mockStateStore} from 'src/testUtils'

import {TestBlockFactory} from 'src/test/testBlockFactory'

import CardDetailContentsMenu from './cardDetailContentsMenu'

//for contentRegistry
import 'src/components/content/textElement'
import 'src/components/content/imageElement'
import 'src/components/content/dividerElement'
import 'src/components/content/checkboxElement'
import {CardDetailProvider} from './cardDetailContext'

jest.mock('src/mutator')

const board = TestBlockFactory.createBoard()
const card = TestBlockFactory.createCard(board)
describe('components/cardDetail/cardDetailContentsMenu', () => {
    const store = mockStateStore([], {})
    const wrap = (child: ReactNode): ReactElement => (
        wrapIntl(
            <ReduxProvider store={store}>
                <CardDetailProvider card={card}>
                    {child}
                </CardDetailProvider>
            </ReduxProvider>,
        )
    )
    beforeEach(() => {
        jest.clearAllMocks()
    })
    test('return cardDetailContentsMenu', async () => {
        const {container} = render(wrap(<CardDetailContentsMenu/>))
        const buttonElement = screen.getByRole('button', {name: 'menuwrapper'})
        await userEvent.click(buttonElement)
        expect(container).toMatchSnapshot()
    })

    // TODO fix this test
    // eslint-disable-next-line no-only-tests/no-only-tests
    test.skip('return cardDetailContentsMenu and add Text content', async () => {
        const {container} = render(wrap(<CardDetailContentsMenu/>))
        const buttonElement = screen.getByRole('button', {name: 'menuwrapper'})
        await userEvent.click(buttonElement)
        expect(container).toMatchSnapshot()
        const buttonAddText = screen.getByRole('button', {name: 'text'})
        await userEvent.click(buttonAddText)
        expect(container).toMatchSnapshot()
    })
})
