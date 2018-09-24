import user from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const getUserInfo = async function (ctx) {
  const id = ctx.params.id // 获取url里传过来的参数里的id
  const result = await user.getUserById(id) // 通过await “同步”地返回查询结果
  ctx.body = result // 将请求的结果放到response的body里返回
}

const postUserAuth = async function (ctx) {
  const data = ctx.request.body // post过来的数据存在request.body里
  const userInfo = await user.getUserByName(data.name)
  if (userInfo != null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(data.password, userInfo.password)) { // 比较秘钥
      ctx.body = {
        success: false, // success标志位是方便前端判断返回是正确与否
        info: '密码错误！'
      }
    } else {
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo' // 指定密钥
      const token = jwt.sign(userToken, secret) // 签发token，即加密某信息
      ctx.body = {
        success: true,
        token: token // 返回token
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！' // 如果用户不存在返回用户不存在
    }
  }
}

async function cookieLogin (ctx, next) {
  let previousUser = ctx.cookies.get('user')
  //
  let currentUser = {}
  if (!previousUser) {
    currentUser.name = 'sunyuqing'
    currentUser.count = 1
  } else {
    previousUser = JSON.parse(previousUser)
    currentUser.name = 'sunyuqing'
    currentUser.count = ++previousUser.count
  }
  ctx.cookies.set('user', JSON.stringify(currentUser))
  ctx.body = {
    success: true,
    currentUser
  }
}
async function sessionSetRandom (ctx, next) {
  ctx.session.random = Math.random()
  ctx.body = {
    success: true,
    random: ctx.session.random
  }
}

async function sessionGetRandom (ctx, next) {
  const random = ctx.session.random
  ctx.body = {
    success: true,
    random: random
  }
}

export default {
  getUserInfo,
  postUserAuth,
  cookieLogin,
  sessionSetRandom,
  sessionGetRandom
}
