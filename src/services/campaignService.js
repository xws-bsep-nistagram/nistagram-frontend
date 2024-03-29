import axios from 'axios';
import { api } from '../api';

async function getCampaignById(id) {
	try {
		return await axios.get(api.campaign.base + '/' + id);
	} catch (err) {
		return err.response;
	}
}

async function createLongTermCampaign(campaign) {
	try {
		return await axios.post(api.campaign.longTerm, campaign);
	} catch (err) {
		return err.response;
	}
}

async function createOneTimeCampaign(campaign) {
	try {
		return await axios.post(api.campaign.oneTime, campaign);
	} catch (err) {
		return err.response;
	}
}

async function updateLongTermCampaign(id, campaign) {
	try {
		return await axios.put(api.campaign.longTerm + '/' + id, campaign);
	} catch (err) {
		return err.response;
	}
}

async function updateOneTimeCampaign(id, campaign) {
	try {
		return await axios.put(api.campaign.oneTime + '/' + id, campaign);
	} catch (err) {
		return err.response;
	}
}

async function getCampaigns() {
	try {
		return await axios.get(api.campaign.base);
	} catch (err) {
		return err.response;
	}
}

async function getAdvertisementClickStats(advertisementId) {
	try {
		return await axios.get(api.campaign.clicks + '/' + advertisementId);
	} catch (err) {
		return err.response;
	}
}

async function registerClick(advertisementId) {
	try {
		return axios.post(api.campaign.clicks + '/' + advertisementId);
	} catch (err) {
		return err.response;
	}
}

async function deleteCampaign(campaignId) {
	try {
		return axios.delete(api.campaign.base + '/' + campaignId);
	} catch (err) {
		return err.response;
	}
}

export {
	getCampaignById,
	createLongTermCampaign,
	createOneTimeCampaign,
	getCampaigns,
	getAdvertisementClickStats,
	registerClick,
	updateLongTermCampaign,
	updateOneTimeCampaign,
	deleteCampaign
}
