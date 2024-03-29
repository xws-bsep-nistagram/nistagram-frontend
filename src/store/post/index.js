import { comment, getPostById } from '@/services/contentService';
import { notifyError } from '@/services/notificationService';
import {
	postLike,
	postDislike,
	deleteDislike,
	deleteLike,
	fetchInteractedPosts
} from '@/services/contentService';
import router from '../../router';
import { notifySuccess } from '../../services/notificationService';
import { approvePost, fetchNonApprovedPosts } from '../../services/contentService';

export default {
	state: {
		post: {
			id: '',
			author: '',
			caption: '',
			comments: [],
			location: {
				name: '',
				latitude: 0,
				longitude: 0
			},
			mediaUrls: [],
			tags: [],
			time: '',
			userInteractions: [],
		},
		interactions: {
			interactedPosts: []
		},
		nonApprovedPosts: []
	},
	mutations: {
		setInteractedPosts: (state, value) => {
			state.interactions.interactedPosts = value;
		},
		setPost: (state, post) => {
			state.post = post;
		},
		addComment: (state, comment) => {
			if (!state.comments) state.comments = [];
			state.post.comments.push(comment);
		},
		addPostLike: (state, user) => {
			if (!state.post.userInteractions) state.post.userInteractions = [];
			state.post.userInteractions.push({ author: user, sentiment: 'LIKE' });
		},
		addPostDislike: (state, user) => {
			if (!state.post.userInteractions) state.post.userInteractions = [];
			state.post.userInteractions.push({ author: user, sentiment: 'DISLIKE' });
		},
		removePostLike: (state, user) => {
			if (!state.post.userInteractions) return;
			state.post.userInteractions = state.post.userInteractions.filter(
				interaction => {
					return !(
						interaction.author === user && interaction.sentiment === 'LIKE'
					);
				}
			);
		},
		removePostDislike: (state, user) => {
			if (!state.post.userInteractions) return;
			state.post.userInteractions = state.post.userInteractions.filter(
				interaction => {
					return !(
						interaction.author === user && interaction.sentiment === 'DISLIKE'
					);
				}
			);
		},
		setNonApprovedPosts: (state, posts) => {
			state.nonApprovedPosts = posts;
		}
	},
	actions: {
		fetchInteractedPosts: async(state) => {
			fetchInteractedPosts()
				.then(response => {
					state.commit('setInteractedPosts', response.data);
					console.log("Fetched interacted posts:", state.getters.interactedPosts);
				})
				.catch(err => notifyError(err.response.data));
		},
		getPostById: async (state, id) => {
			let response = await getPostById(id);
			if (response.status >= 400) {
				notifyError(response.data);
				router.push('/home/feed');
			} else state.commit('setPost', response.data);
		},
		comment: async (state, commentData) => {
			let commentDto = {
				postId: state.getters.id,
				text: commentData,
				author: state.rootGetters.username
			};
			let response = await comment(commentDto);
			if (response.status >= 400) notifyError(response.data);
			else state.commit('addComment', commentDto);
		},
		likePost: async (state, postId) => {
			let response = await postLike(postId);
			if (response.status >= 400) notifyError(response.data);
			else state.commit('addPostLike', state.rootGetters.username);
		},
		dislikePost: async (state, postId) => {
			let response = await postDislike(postId);
			if (response.status >= 400) notifyError(response.data);
			else state.commit('addPostDislike', state.rootGetters.username);
		},
		deleteLikeFromPost: async (state, postId) => {
			let response = await deleteLike(postId);
			if (response.status >= 400) notifyError(response.data);
			else state.commit('removePostLike', state.rootGetters.username);
		},
		deleteDislikeFromPost: async (state, postId) => {
			let response = await deleteDislike(postId);
			if (response.status >= 400) notifyError(response.data);
			else state.commit('removePostDislike', state.rootGetters.username);
		},
		fetchInfluencerPostsForApproval: async (state) => {
			const response = await fetchNonApprovedPosts();
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				state.commit('setNonApprovedPosts', response.data);
			}
		},
		approveInfluencerPost: async (state, postId) => {
			const response = await approvePost(postId);
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				notifySuccess("Ad successfully approved.");
			}
		}
	},
	getters: {
		interactedPosts: state => {
			return state.interactions.interactedPosts;
		},
		id: state => {
			return state.post.id;
		},
		postAuthor: state => {
			return state.post.author;
		},
		postCaption: state => {
			return state.post.caption;
		},
		postComments: state => {
			return state.post.comments;
		},
		postLocation: state => {
			return state.post.location;
		},
		postMediaUrls: state => {
			return state.post.mediaUrls;
		},
		postTime: state => {
			return state.post.time;
		},
		postUserInteractions: state => {
			return state.post.userInteractions;
		},
		postTags: state => {
			return state.post.tags;
		},
		nonApprovedPosts: state => {
			return state.nonApprovedPosts;
		}
	}
};
