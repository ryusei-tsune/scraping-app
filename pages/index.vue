<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card outlined>
          <v-card-title>API TEST</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="request()">
              リクエスト
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card-text>
      {{ resData }}
    </v-card-text>
  </v-container>
</template>
<script>
export default {
  head() {
    return {
      title: "Top Page",
    };
  },
  layout: "default",
  components: {},
  middleware: [],
  data() {
    return {
      resData: null,
    };
  },
  watch: {},
  computed: {
    csv() {
      if (!this.resData?.body) return [];
      return this.resData.body;
    },
  },
  created() {},
  beforeMount() {},
  mounted() {
    //this.reqestAPI()
  },
  beforeDestroy() {},
  methods: {
    async request() {
      try {
        console.log("a")
        const {data} = await this.$axios.get("/api/scraping")
        console.log("b")
        if (!data.ok) throw new Error(data.statusText || "");
        this.$set(this, "resData", data);
        console.log("c")
      } catch (err) {
        console.log("Error");
      }
    },
    async reqestAPI() {
      if (this.isBusy) return;
      this.isBusy = true;
      try {
        const { data } = await this.$axios.get("/api/matsumoto");
        if (!data.ok) throw new Error(data.statusText || "");
        this.$set(this, "resData", data);
      } catch (err) {
        console.error("reqestAPI()", err);
        let message = "";
        if (err?.response?.data?.statusText)
          message = err.response.data.statusText;
        else if (err?.message) message = err.message;
        else message = "Unknown Error";
        this.errorMessage = message;
        this.isOpenErrorDialog = true;
      }
      this.isBusy = false;
    },
  },
};
</script>
<style scoped>
</style>