<template>
	<v-app>
		<notifications group="alert" />
		<router-view />
	</v-app>
</template>

<script>
import { isLogged } from '@/services/authService';

export default {
	name: 'App',
	mounted() {
		this.getPersonalProfile();
	},
	methods: {
		getPersonalProfile() {
			if (isLogged()) {
				try {
					this.$store.dispatch('getProfile');
					this.$store.dispatch('getRoles');
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap');
.content-wrap {
	margin-top: 5rem !important;
	margin-bottom: 0rem !important;
}
</style>
