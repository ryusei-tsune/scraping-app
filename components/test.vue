<template>
  <div>
    <div class="test test2" :style="Styles">Component</div>
  </div>
</template>
<script>
export default {
  components: {},
  middleware: [],
  props: {
    color: {
      type: String,
      required: false,
      default: "red",
    },
  },
  data() {
    return {
      f: '50px',
    };
  },
  computed: {
    Styles() {
      return {
        "--color": this.color,
      };
    },
    fontSize() {
      return {
        "--size": this.f,
      };
    },
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
$M2: yellow;
.test {
  --color: blue;
  $M2: var(--color);
  background-color: $M2;
}
.test2 {
  --size: 30px;
  font-size: var(--size);
}
</style>