import React from 'react'
import { create } from 'react-test-renderer'
import SearchFollowings from '../search-followings'
import axios from 'axios'
import mockAxiosAdapter from 'axios-mock-adapter'
import { shallow, mount } from 'enzyme'
import users from './users-mockArray'

describe('Search-Followings Component', () => {
  const mockFn = () => {}
  const comp = (
    <SearchFollowings
      when='new_con'
      done={mockFn}
    />
  )
  const mock = new mockAxiosAdapter(axios)

  // mock request
  mock
    .onPost('/api/search-followings')
    .reply(200, users)

  it('should match snapshot', () => {
    const tree = create(comp).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should get users from API on componentDidMount', async () => {
    const wrapper = shallow(comp)
    await wrapper.instance().componentDidMount()
    expect(wrapper.state().data).toBeArray()
    expect(wrapper.state().data[0]).toContainKeys(
      ['follow_to', 'follow_to_username']
    )
  })

  it('should return matched users when typing', async () => {
    const wrapper = mount(comp)
    await wrapper.instance().componentDidMount()

    // should return coldplay as cold matches only coldplay
    wrapper.find('input').simulate(
      'change',
      { target: { value: 'cold' } }
    )
    expect(wrapper.state().followings).toBeArrayOfSize(1)
    expect(wrapper.state().followings[0]).toContainEntries([
      ['follow_to', 8],
      ['follow_to_username', 'coldplay']
    ])

    // should return ghalib as gh matches ghalib only
    wrapper.find('input').simulate(
      'change',
      { target: { value: 'gh' } }
    )
    expect(wrapper.state().followings).toBeArrayOfSize(1)
    expect(wrapper.state().followings[0]).toContainEntries([
      ['follow_to', 7],
      ['follow_to_username', 'ghalib']
    ])

    // should return [] as gh matches neither ghalib nor coldplay
    wrapper.find('input').simulate(
      'change',
      { target: { value: 'something-diff' } }
    )
    expect(wrapper.state().followings).toBeArrayOfSize(0)
  })

})
