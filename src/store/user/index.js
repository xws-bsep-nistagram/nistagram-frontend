import {
	createAgentRegistrationRequest,
	banUser,
	getNotificationPreferences,
	getPrivacyData,
	getProfile,
	updateNotificationPreferences,
	updatePrivacyData,
	updateProfile
} from '../../services/userService';
import { notifyError, notifySuccess } from '../../services/notificationService';
import { getFollowerRequests } from '../../services/graphService';
import { getRoles } from '../../services/authService';
import {isAgentRequestRejected} from "@/services/userService";

export default {
	state: {
		personalData: {
			username: '',
			fullName: '',
			dateOfBirth: '',
			gender: '',
			phoneNumber: '',
			email: '',
			website: '',
			bio: '',
			verified: null
		},
		privacyData: {
			profilePrivate: '',
			messagesFromNonFollowersAllowed: '',
			taggable: ''
		},
		notificationPreferences: {
			comment: '',
			likes: '',
			dislikes: '',
			shares: '',
			photosOfMe: '',
			followerRequestNotificationEnabled: '',
			followRequestAcceptedNotificationEnabled: '',
			newFollowerNotificationEnabled: '',
			messageRequestNotificationEnabled: '',
			messageNotificationEnabled: ''
		},
		followerRequests: [],
		roles: [],
		agentRegistration: {
			website: '',
			isAgentRequestRejected: false
		}
	},
	mutations: {
		setAgentRequestRejected: (state, value) => {
			state.agentRegistration.isAgentRequestRejected = value;
		},
		setFullName: (state, fullName) => {
			state.personalData.fullName = fullName;
		},
		setDateOfBirth: (state, dateOfBirth) => {
			state.personalData.dateOfBirth = dateOfBirth;
		},
		setGender: (state, gender) => {
			state.personalData.gender = gender;
		},
		setPhoneNumber: (state, phoneNumber) => {
			state.personalData.phoneNumber = phoneNumber;
		},
		setEmail: (state, email) => {
			state.personalData.email = email;
		},
		setWebsite: (state, website) => {
			state.personalData.website = website;
		},
		setBio: (state, bio) => {
			state.personalData.bio = bio;
		},
		setPersonalData: (state, personalData) => {
			state.personalData = personalData;
		},
		setComment: (state, comment) => {
			state.notificationPreferences.comment = comment;
		},
		setLikes: (state, likes) => {
			state.notificationPreferences.likes = likes;
		},
		setDislikes: (state, dislikes) => {
			state.notificationPreferences.dislikes = dislikes;
		},
		setShares: (state, shares) => {
			state.notificationPreferences.shares = shares;
		},
		setPhotosOfMe: (state, photosOfMe) => {
			state.notificationPreferences.photosOfMe = photosOfMe;
		},
		setFollowerRequestNotificationEnabled: (
			state,
			followerRequestNotificationEnabled
		) => {
			state.notificationPreferences.followerRequestNotificationEnabled = followerRequestNotificationEnabled;
		},
		setFollowRequestAcceptedNotificationEnabled: (
			state,
			followRequestAcceptedNotificationEnabled
		) => {
			state.notificationPreferences.followRequestAcceptedNotificationEnabled = followRequestAcceptedNotificationEnabled;
		},
		setNewFollowerNotificationEnabled: (
			state,
			newFollowerNotificationEnabled
		) => {
			state.notificationPreferences.newFollowerNotificationEnabled = newFollowerNotificationEnabled;
		},
		setMessageRequestNotificationEnabled: (
			state,
			messageRequestNotificationEnabled
		) => {
			state.notificationPreferences.messageRequestNotificationEnabled = messageRequestNotificationEnabled;
		},
		setMessageNotificationEnabled: (state, messageNotificationEnabled) => {
			state.notificationPreferences.messageNotificationEnabled = messageNotificationEnabled;
		},
		setNotificationPreferences: (state, notificationPreferences) => {
			state.notificationPreferences = notificationPreferences;
		},
		setProfilePrivate: (state, profilePrivate) => {
			state.privacyData.profilePrivate = profilePrivate;
		},
		setMessagesFromNonFollowersAllowed: (
			state,
			messagesFromNonFollowersAllowed
		) => {
			state.privacyData.messagesFromNonFollowersAllowed = messagesFromNonFollowersAllowed;
		},
		setTaggable: (state, taggable) => {
			state.privacyData.taggable = taggable;
		},
		setPrivacyData: (state, privacyData) => {
			state.privacyData = privacyData;
		},
		setFollowerRequests: (state, requests) => {
			state.followerRequests = requests;
		},
		setRoles: (state, roles) => {
			state.roles = roles;
		},
		clearRoles: state => {
			state.roles = [];
		},
		setAgentRegistrationWebsiteUrl: (state, url) => {
			state.agentRegistration.website = url;
		}
	},
	actions: {
		getProfile: async ({ commit }) => {
			const response = await getProfile();
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				commit('setPersonalData', response.data);
			}
		},
		banUser: async (context, username) => {
			const response = await banUser(username);
			if (response.status >= 400) notifyError(response.data);
			else notifySuccess(`User ${username} succesfully banned`);
		},
		updateProfile: async context => {
			const response = await updateProfile(context.state.personalData);
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				context.commit('setPersonalData', response.data);
			}
		},
		getNotificationPreferences: async ({ commit }) => {
			const response = await getNotificationPreferences();
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				commit('setNotificationPreferences', response.data);
			}
		},
		updateNotificationPreferences: async context => {
			const response = await updateNotificationPreferences(
				context.state.notificationPreferences
			);
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				context.commit('setNotificationPreferences', response.data);
			}
		},
		getPrivacyData: async ({ commit }) => {
			const response = await getPrivacyData();
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				commit('setPrivacyData', response.data);
			}
		},
		updatePrivacyData: async context => {
			const response = await updatePrivacyData(context.state.privacyData);
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				context.commit('setPrivacyData', response.data);
			}
		},
		getFollowerRequests: async context => {
			const response = await getFollowerRequests(
				context.state.personalData.username
			);
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				context.commit('setFollowerRequests', response.data);
			}
		},
		getRoles: async context => {
			const response = await getRoles();
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				context.commit('setRoles', response.data.roles);
			}
		},
		requestAgentRegistration: async context => {
			const response = await createAgentRegistrationRequest(
				context.state.agentRegistration
			);
			if (response.status >= 400) {
				notifyError(response.data);
			} else {
				notifySuccess('Request successfully registered.');
			}
		},
		checkIsRequestRejected: async context => {
			isAgentRequestRejected()
			.then(res => {
				context.commit('setAgentRequestRejected', res.data);
			})
			.catch(err => console.error(err.response.data));
		},
		clearRoles: async context => {
			context.commit('clearRoles');
		}
	},
	getters: {
		agentRequestRejected: state => {
			return state.agentRegistration.isAgentRequestRejected;
		},
		username: state => {
			return state.personalData.username;
		},
		fullName: state => {
			return state.personalData.fullName;
		},
		dateOfBirth: state => {
			return state.personalData.dateOfBirth;
		},
		gender: state => {
			return state.personalData.gender;
		},
		phoneNumber: state => {
			return state.personalData.phoneNumber;
		},
		email: state => {
			return state.personalData.email;
		},
		website: state => {
			return state.personalData.website;
		},
		bio: state => {
			return state.personalData.bio;
		},
		verified: state => {
			return state.personalData.verified;
		},
		comment: state => {
			return state.notificationPreferences.comment;
		},
		likes: state => {
			return state.notificationPreferences.likes;
		},
		dislikes: state => {
			return state.notificationPreferences.dislikes;
		},
		shares: state => {
			return state.notificationPreferences.shares;
		},
		photosOfMe: state => {
			return state.notificationPreferences.photosOfMe;
		},
		followerRequestNotificationEnabled: state => {
			return state.notificationPreferences.followerRequestNotificationEnabled;
		},
		followRequestAcceptedNotificationEnabled: state => {
			return state.notificationPreferences
				.followRequestAcceptedNotificationEnabled;
		},
		newFollowerNotificationEnabled: state => {
			return state.notificationPreferences.newFollowerNotificationEnabled;
		},
		messageRequestNotificationEnabled: state => {
			return state.notificationPreferences.messageRequestNotificationEnabled;
		},
		messageNotificationEnabled: state => {
			return state.notificationPreferences.messageNotificationEnabled;
		},
		profilePrivate: state => {
			return state.privacyData.profilePrivate;
		},
		messagesFromNonFollowersAllowed: state => {
			return state.privacyData.messagesFromNonFollowersAllowed;
		},
		taggable: state => {
			return state.privacyData.taggable;
		},
		followerRequests: state => {
			return state.followerRequests;
		},
		roles: state => {
			return state.roles;
		},
		agentRegistrationWebsiteUrl: state => {
			return state.agentRegistration.website;
		}
	}
};
