/* eslint-disable no-unused-vars */
import {
	fetchPostFeed,
	fetchStoryFeed,
	fetchCloseFriendStoryFeed, fetchStoryCampaignFeed
} from '../../services/feedService';

import {
	postLike,
	postDislike,
	deleteDislike,
	deleteLike, getPersonalStories
} from '../../services/contentService';

import { getPostById, getStoryById } from '../../services/contentService';

import { notifyError } from '../../services/notificationService';
import { getCampaignById } from '../../services/campaignService';

export default {
	state: {
		posts: [],
		postsLoaded: false,
		storyGroups: [],
		closeFriendStoryGroups: [],
		personalStories: [],
		storyCampaigns: []
	},
	mutations: {
		setPosts: (state, posts) => {
			state.posts = posts;
		},
		setCloseFriendStoryGroups: (state, closeFriendStoryGroups) => {
			state.closeFriendStoryGroups = closeFriendStoryGroups;
		},
		setStoryGroups: (state, storyGroups) => {
			state.storyGroups = storyGroups;
		},
		setCloseFriendStores: (state, closeFriendStories) => {
			state.closeFriendStories = closeFriendStories;
		},
		setPostsLoaded: state => {
			state.postsLoaded = true;
		},
		assignPostData: (state, postInfo) => {
			state.posts.filter(post => {
				return post.contentId == postInfo.postId;
			})[0].postData = postInfo.postData;
		},
		setPersonalStories: (state, personalStories) => {
			state.personalStories = personalStories;
		},
		setStoryCampaigns: (state, campaigns) => {
			state.storyCampaigns = campaigns;
		}
	},
	actions: {
		fetchPosts: async state => {
			let response = await fetchPostFeed();
			if (response.status >= 400) {
				notifyError(response.data);
				return;
			}
			state.commit('setPosts', response.data);
			await state.dispatch('fetchPostData');
		},
		fetchPostData: async state => {
			for (const post of state.getters.posts) {
				let response;
				if (!post.ad) {
					response = await getPostById(post.contentId);
				} else {
					response = await getCampaignById(post.contentId);
				}
				if (response.status >= 400) notifyError(response.data);
				else {
					state.commit('assignPostData', {
						postId: post.contentId,
						postData: response.data
					});
				}
				state.commit('setPostsLoaded');
			}
		},
		fetchStories: async state => {
			let response = await fetchStoryFeed();
			if (response.status >= 400) {
				notifyError(response.data);
				return;
			}
			state.commit('setStoryGroups', response.data);
			state.dispatch('fetchStoryData');
		},
		fetchStoryData: async state => {
			state.getters.storyGroups.forEach(async storyGroup => {
				storyGroup.entries.forEach(async entry => {
					const response = await getStoryById(entry.contentId);
					if (response.status >= 400) notifyError(response.data);
					else entry.storyData = response.data;
				});
			});
		},
		fetchStoryCampaigns: async state => {
			const response = await fetchStoryCampaignFeed();
			if (response.status >= 400) {
				notifyError(response.data);
				return;
			}
			state.commit('setStoryCampaigns', response.data);
			await state.dispatch('fetchStoryCampaignData');
		},
		fetchStoryCampaignData: async state => {
			let response;
			for await (const campaign of state.getters.storyCampaigns) {
				response = await getCampaignById(campaign.contentId);
				if (response.status >= 400) notifyError(response.data);
				else campaign.storyData = response.data;
			}
		},
		fetchCloseFriendStories: async state => {
			let response = await fetchCloseFriendStoryFeed();
			if (response.status >= 400) {
				notifyError(response.data);
				return;
			}
			state.commit('setCloseFriendStoryGroups', response.data);
			state.dispatch('fetchCloseFriendStoryData');
		},
		fetchPersonalStories: async state => {
			const response = await getPersonalStories();
			if (response.status >= 400) {
				notifyError(response.data);
				return;
			}
			state.commit('setPersonalStories', response.data);
		},
		fetchCloseFriendStoryData: async state => {
			state.getters.closeFriendStoryGroups.forEach(async storyGroup => {
				storyGroup.entries.forEach(async entry => {
					let response = await getStoryById(entry.contentId);
					if (response.status >= 400) notifyError(response.data);
					else entry.storyData = response.data;
				});
			});
		},
		like: async (state, postId) => {
			let response = await postLike(postId);
			if (response.status >= 400) notifyError(response.data);
		},
		dislike: async (state, postId) => {
			let response = await postDislike(postId);
			if (response.status >= 400) notifyError(response.data);
		},
		deleteLike: async (state, postId) => {
			let response = await deleteLike(postId);
			if (response.status >= 400) notifyError(response.data);
		},
		deleteDislike: async (state, postId) => {
			let response = await deleteDislike(postId);
			if (response.status >= 400) notifyError(response.data);
		}
	},

	getters: {
		posts: state => {
			return state.posts;
		},
		storyGroups: state => {
			return state.storyGroups;
		},
		closeFriendStoryGroups: state => {
			return state.closeFriendStoryGroups;
		},
		personalStories: state => {
			return state.personalStories;
		},
		storyCampaigns: state => {
			return state.storyCampaigns;
		}
	}
};
