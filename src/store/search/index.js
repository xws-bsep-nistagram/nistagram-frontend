import {
	findUsers,
	findPosts,
	findTaggableUsers
} from '../../services/searchService';
import {notifyError} from "@/services/notificationService";

export default {
	state: {
		queries: {
			userQuery: '',
			taggableUserQuery: '',
			locationQuery: null,
			tagQuery: []
		},
		results: {
			users: [],
			posts: []
		},
		location: {
			street: ''
		}
	},
	mutations: {
		setLocationStreet: (state, street) => {
			state.location.street = street;
		},
		setTaggableUserQuery: (state, userQuery) => {
			state.queries.taggableUserQuery = userQuery;
		},
		setUserQuery: (state, userQuery) => {
			state.queries.userQuery = userQuery;
		},
		setLocationQuery: (state, locationQuery) => {
			state.queries.locationQuery = locationQuery;
		},
		setTagQuery: (state, tagQuery) => {
			state.queries.locationQuery = tagQuery;
		},
		setUsers: (state, users) => {
			state.results.users = users;
		},
		setPosts: (state, posts) => {
			state.results.posts = posts;
		},
		appendTag: (state, tag) => {
			state.queries.tagQuery = [...state.queries.tagQuery, tag];
		},
		removeTag: (state, tag) => {
			state.queries.tagQuery = state.queries.tagQuery.filter(
				tagEntry => tagEntry !== tag
			);
		}
	},
	actions: {
		findUsersByUsername: async state => {
			const response = await findUsers(state.getters.userQuery);
			state.commit('setUsers', response);
		},
		findTaggableUsersByUsername: async state => {
			const response = await findTaggableUsers(state.getters.taggableUserQuery);
			state.commit('setUsers', response);
		},
		findPostsByLocation: async state => {
			console.log("Location", state.getters.locationStreet);
			findPosts(state.getters.locationStreet)
				.then(response => {
					console.log("Found some posts:", response.data);
					state.commit('setPosts', response.data);
				})
				.catch(e => {
					notifyError("Failed to load");
					console.error(e.response.data);
				})
		},
		appendTag: (state, tag) => {
			state.commit('appendTag', tag);
		},
		removeTag: (state, tag) => {
			state.commit('removeTag', tag);
		}
	},
	getters: {
		locationStreet: state => {
			return state.location.street;
		},
		taggableUserQuery: state => {
			return state.queries.taggableUserQuery;
		},
		userQuery: state => {
			return state.queries.userQuery;
		},
		locationQuery: state => {
			return state.queries.locationQuery;
		},
		tagQuery: state => {
			return state.queries.tagQuery;
		},
		foundUsers: state => {
			return state.results.users;
		},
		foundPosts: state => {
			return state.results.posts;
		}
	}
};
