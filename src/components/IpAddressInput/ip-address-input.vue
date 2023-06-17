<template>
  <div>
    <div class="ip-input">
      <el-input
        class="input0Ref"
        ref="input0"
        name="0"
        v-model:model-value.number="ipValueArray[0]"
        :maxlength="3"
        :autofocus="true"
        @input="(input:string)=>{ipAddressInput(input,0)}"
        :formatter="formatter"
        @keyup="(e:any)=>{keyupFunc(e,0)}"
      >
        <template #prefix>
          <i class="iconfont icon-the-server"></i> </template></el-input
      >·
      <el-input
        ref="input1Ref"
        v-model:model-value="ipValueArray[1]"
        :maxlength="3"
        @input="(input:string)=>{ipAddressInput(input,1)}"
        :formatter="formatter"
        @keyup="(e:any)=>{keyupFunc(e,1)}"
      ></el-input
      >·
      <el-input
        ref="input2Ref"
        v-model:model-value="ipValueArray[2]"
        :maxlength="3"
        @input="(input:string)=>{ipAddressInput(input,2)}"
        :formatter="formatter"
        @keyup="(e:any)=>{keyupFunc(e,2)}"
      ></el-input
      >·
      <el-input
        ref="input3Ref"
        v-model:model-value="ipValueArray[3]"
        :maxlength="3"
        @input="(input:string)=>{ipAddressInput(input,3)}"
        :formatter="formatter"
        @keyup="(e:any)=>{keyupFunc(e,3)}"
      ></el-input>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(["ipAddress"]);
const emit = defineEmits(["update:ipAddress"]);

const input0Ref = ref();
const input1Ref = ref();
const input2Ref = ref();
const input3Ref = ref();
const ipValueArray: any = ref<string[]>(["", "", "", ""]);
watch(
  () => props.ipAddress,
  (ip) => {
    const ipArray = ip.split(".");
    ipArray.map((i: string, index: number) => {
      ipValueArray.value[index] = i;
    });
  },
  { immediate: true }
);
const ipAddressInput = (input: string, index: number) => {
  if (input.length >= 3) {
    if (index === 0) {
      input1Ref.value.focus();
    }
    if (index === 1) {
      input2Ref.value.focus();
    }
    if (index === 2) {
      input3Ref.value.focus();
    }
  }
  emit("update:ipAddress", ipValueArray.value.join("."));
};

const formatter = (text: string) => {
  const reg = /^\d+$/;
  let result = "";
  const strTextArray = text.split("");
  strTextArray.map((item: string) => {
    if (reg.test(item)) {
      return (result += item);
    }
  });
  return result;
};
const keyupFunc = (e: any, index: number) => {
  if (e.key === ".") {
    if (index === 0) {
      input1Ref.value.focus();
    }
    if (index === 1) {
      input2Ref.value.focus();
    }
    if (index === 2) {
      input3Ref.value.focus();
    }
  }
  if (e.key === "Backspace") {
    if (index === 3) {
      if (!ipValueArray.value[index]) {
        input2Ref.value.focus();
      }
    }
    if (index === 2) {
      if (!ipValueArray.value[index]) {
        input1Ref.value.focus();
      }
    }
    if (index === 1) {
      if (!ipValueArray.value[index]) {
        input0Ref.value.focus();
      }
    }
  }
};
</script>

<style lang="scss">
.ip-input {
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
  .el-input {
    &.input0 {
      flex: 2;
      .el-input__prefix-inner > :last-child {
        margin-right: 15px;
      }
      .el-input__wrapper {
        padding-right: 3px;
      }
      .el-input__inner {
        padding: 1px 8px;
      }
    }
    flex: 1;
    .el-input__wrapper {
      border-bottom: 0px !important;
    }
  }
}
</style>
