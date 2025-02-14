<template>
	<v-container fluid class="pb-1 pt-2">
		<!--<IndeterminatedTopProgressBar v-if="loadingData"></IndeterminatedTopProgressBar>-->
		<v-alert text prominent tile origin type="error" v-if="loadingError">{{ $vuetify.lang.t("$vuetify.loadError") }}</v-alert>
		<v-row dense align="start" justify="center" v-if="!loadingError">
			<v-col cols="12" sm="12" md="3" lg="2" xl="2">
				<template v-if="loadingData">
					<CardSkeleton></CardSkeleton>
					<CardSkeleton></CardSkeleton>
					<CardSkeleton></CardSkeleton>
				</template>
				<template v-else>
					<SimpleMultilineCard
						:title="$vuetify.lang.t(`$vuetify.encounterCard`)"
						:firstLine="dungeonName"
						:secondLine="bossName"
						:thirdLine="`by ${runData.uploader}`">
					</SimpleMultilineCard>
					<SimpleDateTimeTextCard
						:title="$vuetify.lang.t(`$vuetify.dateCard`)"
						:firstLine="getFormattedHours"
						:secondLine="getFormattedDate"
						:timeLine="runData.encounterUnixEpoch"></SimpleDateTimeTextCard>
					<BossEnrageCard :uptime="enrageData"></BossEnrageCard>
					<BossDebuffsCard
						:abnormalsData="abnormalsData"
						:debuffDetail="runData.debuffDetail">
					</BossDebuffsCard>
				</template>
			</v-col>
			<v-col cols="12" sm="12" md="9" lg="9" xl="9">
				<template v-if="loadingData">
					<CardTableSkeleton></CardTableSkeleton>
				</template>
				<template v-else>
					<div :class="[currentTheme, !$vuetify.breakpoint.mobile ? 'scroller-cutted': '']">
						<v-row no-gutters justify="center">
							<SimpleOneLineCard
								centeredTitle=true
								centeredText=true
								:title="$vuetify.lang.t(`$vuetify.region`)"
								:line="runData.region.toUpperCase()">
							</SimpleOneLineCard>
							<SimpleOneLineCard
								centeredTitle=true
								centeredText=true
								:title="$vuetify.lang.t(`$vuetify.duration`)"
								:line="formatStringAsTimeSpan(runData.fightDuration)"></SimpleOneLineCard>
							<SimpleOneLineCard
								centeredTitle=true
								centeredText=true
								:title="$vuetify.lang.t(`$vuetify.partyDps`)"
								:line="formatStringAsDps(runData.partyDps)"></SimpleOneLineCard>
							<SimpleOneLineCard
								centeredTitle=true
								centeredText=true
								:title="$vuetify.lang.t(`$vuetify.avgDpsCard`)"
								:line="formatStringAsDps(getAverageDps)"></SimpleOneLineCard>
							<SimpleOneLineCard
								centeredTitle=true
								centeredText=true
								:title="$vuetify.lang.t(`$vuetify.deathsCard`)"
								:line="getAllDeaths"></SimpleOneLineCard>
							<SimpleOneLineCard
								centeredTitle=true
								centeredText=true
								:title="$vuetify.lang.t(`$vuetify.floortimeCard`)"
								:line="formatStringAsTimeSpan(getDeathTime)"></SimpleOneLineCard>
						</v-row>
						<v-row no-gutters dense>
							<DetailGraphsTabs
								:fightDuration="runData.fightDuration"
								:members="runData.members">
							</DetailGraphsTabs>
						</v-row>
						<v-row no-gutters dense>
							<PlayersInfoPanel
								:abnormalsData="abnormalsData"
								:skillData="skillsData"
								:members="runData.members"
								:fightDuration="runData.fightDuration">
							</PlayersInfoPanel>
						</v-row>
					</div>
				</template>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { DateTime } from "luxon";

import BossEnrageCard from "@/components/DetailGraphs/BossEnrageCard.vue";
import BossDebuffsCard from "@/components/DetailGraphs/BossDebuffsCard.vue";
//import IndeterminatedTopProgressBar from "@/components/Shared/IndeterminatedTopProgressBar.vue";
import PlayersInfoPanel from "@/components/Details/PlayersInfoPanel.vue";
import DetailGraphsTabs from "@/components/Details/DetailGraphsTabs.vue";
//import RegisteredDamageCard from "@/components/DetailGraphs/RegisteredDamageCard.vue";
import CardSkeleton from "@/components/Skeletons/CardSkeleton.vue";
import CardTableSkeleton from "@/components/Skeletons/CardTableSkeleton.vue";

import SimpleMultilineCard from "@/components/Shared/SimpleMultilineCard.vue";
import SimpleDateTimeTextCard from "@/components/Shared/SimpleMultilineDateCard.vue";
import SimpleOneLineCard from "@/components/Shared/SimpleOneLineCard.vue";

export default {
	name: "DetailedRun",
	components: {
		BossEnrageCard,
		BossDebuffsCard,
		//IndeterminatedTopProgressBar,
		PlayersInfoPanel,
		SimpleMultilineCard,
		DetailGraphsTabs,
		//RegisteredDamageCard,
		SimpleDateTimeTextCard,
		SimpleOneLineCard,
		CardSkeleton,
		CardTableSkeleton
	},
	props: {
		runId: String
	},
	data: () => ({
		loadingError: false,
		loadingSkillsData: true,
		loadingAbnormalData: true,
		//loadingMonsterData: true,
		loadingRunData: true,
		abnormalsData: {},
		skillsData: {},
		//monsterData: {},
		runData: {}
	}),
	computed: {
		shameBorderClass(bool) {
			return bool ? "shame" : "";
		},
		enrageData() {
			try {
				let item = this.runData.debuffDetail.find((x) => x[0] === 8888888);
				return item[1][0][1] || 0;
			}
			catch(ex) {
				return 0;
			}
		},
		bossName() {
			return this.$vuetify.lang.t(
				`$vuetify.monsters.${this.runData.huntingZoneId}.monsters.${this.runData.bossId}.name`
			);
		},
		dungeonName() {
			return this.$vuetify.lang.t(
				`$vuetify.monsters.${this.runData.huntingZoneId}.name`
			);
		},
		loadingData() {
			return (
				this.loadingSkillsData ||
				this.loadingAbnormalData ||
				this.loadingRunData
			);
		},
		allDeaths() {
			const deaths = this.runData.members.map((x) => x.playerDeaths);
			const summ = deaths.reduce((a, b) => Number(a) + Number(b), 0);
			return summ;
		},
		getFormattedHours() {
			let date = DateTime.fromSeconds(this.runData.encounterUnixEpoch);

			return date.toLocaleString(DateTime.TIME_SIMPLE);
		},
		getFormattedDate() {
			let date = DateTime.fromSeconds(this.runData.encounterUnixEpoch);

			return date.toLocaleString(DateTime.DATE_FULL);
		},
		getAverageDps() {
			return this.runData.partyDps / (this.runData.members.length || 1);
		},
		getAllDeaths() {
			let deaths = 0;
			this.runData.members.forEach((member) => {
				deaths += Number(member.playerDeaths);
			});

			return deaths;
		},
		getDeathTime() {
			let deathTime = 0;
			this.runData.members.forEach((member) => {
				deathTime += Number(member.playerDeathDuration);
			});

			return deathTime;
		},
	},
	watch: {
		"$vuetify.lang.current"() {
			this.loadDynamicAbnormalData();
			this.loadDynamicSkillData();
			//this.loadDynamicMonsterData();
		},
		"$route.params.runId"() {
			this.loadRunDetail();
		}
	},
	created: function () {
		this.loadDynamicAbnormalData();
		this.loadDynamicSkillData();
		//this.loadDynamicMonsterData();
		this.loadRunDetail();
	},
	methods: {
		loadRunDetail() {
			this.$api.run(this.runId)
				.then((res) => {
					this.runData = res.data;
					this.loadingRunData = false;
				// eslint-disable-next-line no-empty-function
				}).catch(() => {
					this.loadingRunData = false;
					this.loadingError = true;
				});
		},
		loadDynamicAbnormalData() {
			this.$res.abns(this.$vuetify.lang.current)
				.then((res) => {
					this.abnormalsData = res.data;
					this.loadingAbnormalData = false;
				// eslint-disable-next-line no-empty-function
				}).catch(() => { });
		},
		loadDynamicSkillData() {
			this.$res.skills(this.$vuetify.lang.current)
				.then((res) => {
					this.skillsData = res.data;
					this.loadingSkillsData = false;
				// eslint-disable-next-line no-empty-function
				}).catch(() => { });
		},
		loadDynamicMonsterData() {
			this.$res.monsters(this.$vuetify.lang.current)
				.then((res) => {
					this.monsterData = res.data;
					this.loadingMonsterData = false;
				// eslint-disable-next-line no-empty-function
				}).catch(() => { });
		}
	},
};
</script>
