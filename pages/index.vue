<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <v-card outlined color="blue lighten-5">
          <v-card-title style="font-size:45px;">Get Book Information</v-card-title>
          <v-card-text style="font-size:25px;" class="pt-4">これは研究で蔵書情報を取得するために作られたアプリケーションです。</v-card-text>
          <v-card-text style="font-size:25px;">このページ自体に意味はありません</v-card-text>
          <!-- <v-text-field
            v-model="bookname"
            outlined
            placeholder="検索ワード"
          ></v-text-field>
          <v-card-text>
            <v-btn color="primary" @click="request()"> リクエスト </v-btn>
          </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="6"
        v-for="(item, index) in resData"
        :key="`response-data-${index}`"
      >
        <v-card color="pink lighten-5">
          <v-card-text>
            {{ item.bookname }}
          </v-card-text>
          <v-card-text>
            {{ item.Author }}
          </v-card-text>
          <v-card-text>
            {{ item.Publisher }}
          </v-card-text>
          <v-card-text>
            {{ item.Existing }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
      bookname: "",
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