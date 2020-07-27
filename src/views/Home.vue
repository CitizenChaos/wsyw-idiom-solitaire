<template>
  <div class="home">
    <el-form :rules="rules" ref="form" :model="form" size="small" label-position="top">
      <el-form-item label="成语" prop="idiom">
        <el-input v-model="form.idiom"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">生成</el-button>
      </el-form-item>
    </el-form>
    <div>{{ result }}</div>
  </div>
</template>

<script>
import cnchar from 'cnchar'
import 'cnchar-idiom'

export default {
  name: 'Home',
  data() {
    const validateIdiom = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入成域'))
      } else {
        if (!/[\u4e00-\u9fa5]+/.test(this.form.idiom)) {
          callback(new Error('成域含有非汉字'))
        }
        callback()
      }
    }
    return {
      form: {
        idiom: ''
      },
      rules: {
        idiom: [
          { required: true, validator: validateIdiom, trigger: 'blur' }
        ]
      },
      resultArr: [],
      result: ''
    }
  },
  created() {},
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.resultArr = []
          this.generator(this.getLastWordSpell(this.form.idiom))
        }
      })
    },
    generator(lastWordSpell) {
      const tempResArr = cnchar.idiom(lastWordSpell, 'spell')
      if (!tempResArr.length) {
        this.$message({
          type: 'warning',
          message: '矮鸭'
        })
        this.result = this.resultArr.join(' - ')
        return
      }
      const lastOneIsWei = tempResArr.some(el => {
        if (this.getLastWordSpell(el) === 'wei') {
          this.resultArr.push(el)
        }
        return this.getLastWordSpell(el) === 'wei'
      })
      if (lastOneIsWei) {
        this.resultArr.push('为所欲为')
        this.result = this.resultArr.join(' - ')
      } else {
        const randomNum = this.getRandomNum(0, tempResArr.length)
        this.resultArr.push(tempResArr[randomNum])
        this.generator(this.getLastWordSpell(tempResArr[randomNum]))
      }
    },
    getLastWordSpell(s) {
      s = s || ''
      return cnchar.spell(s.replace(/^(.*[n])*.*(.|n)$/g, '$2')).toLowerCase()
    },
    // 生成从minNum到maxNum的随机数
    getRandomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10)
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        default:
          return 0
      }
    }
  }
}
</script>
