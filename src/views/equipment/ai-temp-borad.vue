<template>
  <div>

    <h1>Home Page</h1>
    <button @click="openNew('ai-temp-board-detail') ">实时温度详情</button>
  </div>
</template>

<script>
export default {
  methods: {

    openNew(path) {
      let newUrl = this.$router.resolve({ path: path });
      window.open(newUrl.href, '_blank');
    },
  },
};
</script>
