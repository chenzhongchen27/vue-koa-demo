import auth from '../controllers/user.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/user/:id', auth.getUserInfo) // 定义url的参数是id
router.post('/user', auth.postUserAuth)
router.post('/cookie/login', auth.cookieLogin)
router.post('/session/set/random', auth.sessionSetRandom)
router.post('/session/get/random', auth.sessionGetRandom)

export default router
