import axios from 'axios';
import { api } from '../api';

async function isFollowingProfile(username) {
	try {
		return await axios.get(api.graph.following + '/' + username);
	} catch (err) {
		return err.response;
	}
}

async function isPendingProfile(username) {
	try {
		return await axios.get(api.graph.pending + '/' + username);
	} catch (err) {
		return err.response;
	}
}

async function followProfile(username) {
	try {
		return await axios.get(api.graph.follow + '/' + username);
	} catch (err) {
		return err.response;
	}
}

async function unfollowProfile(username) {
	try {
		return await axios.delete(api.graph.follow + '/' + username);
	} catch (err) {
		return err.response;
	}
}

// eslint-disable-next-line no-unused-vars
async function getFollowerRequests(username) {
	try {
		return await axios.get(api.graph.pendingFollowers);
	} catch (err) {
		return err.response;
	}
}

async function acceptFollowerRequest(username) {
	try {
		return await axios.post(api.graph.follow + '/accept/' + username);
	} catch (err) {
		return err.response;
	}
}

async function declineFollowerRequest(username) {
	try {
		return await axios.delete(api.graph.follow + '/decline/' + username);
	} catch (err) {
		return err.response;
	}
}

export {
	isFollowingProfile,
	isPendingProfile,
	followProfile,
	unfollowProfile,
	getFollowerRequests,
	acceptFollowerRequest,
	declineFollowerRequest
};
