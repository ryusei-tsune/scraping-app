<template>
  <v-container>
    <Test color="green"></Test>
    <v-row dense>
      <v-col cols="12">
        <v-card outlined color="blue lighten-5">
          <v-card-title style="font-size: 45px"
            >Get Book Information</v-card-title
          >
          <v-card-text style="font-size: 25px" class="pt-4"
            >これは研究で蔵書情報を取得するために作られたアプリケーションです。</v-card-text
          >
          <v-card-text style="font-size: 25px"
            >このページ自体に意味はありません。</v-card-text
          >
          <v-card-text style="font-size: 25px"
            >取得情報を可視化した状態が下の画像になります．</v-card-text
          >
        </v-card>
        <v-card outlined class="pa-2" color="lime lighten-5">
          <v-img src="/GetInformation.png" width="50%" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Test from '~/components/test.vue'
export default {
  head() {
    return {
      title: "Scraping-app",
    };
  },
  props: {
  },
  layout: "default",
  components: {
    Test,
  },
  middleware: [],
  data() {
    return {
      resData: null,
      bookname: "",
    };
  },
  watch: {},
  computed: {
    // CSS変数を定義して、CSS側に渡したいVueコンポーネントの値を指定する
    // ※今回はpropsで受け取った値
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
        if (this.bookname != "") {
          console.log("request");
          const { data } = await this.$axios.post("/api/scraping", {
            name: this.bookname,
          });
          //if (!data.ok) throw new Error(data.statusText || "");
          this.$set(this, "resData", data);
          cosole.log("complete");
        }
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