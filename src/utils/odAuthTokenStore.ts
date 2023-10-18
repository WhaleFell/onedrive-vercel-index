import Redis from 'ioredis'
import siteConfig from '../../config/site.config'
import useLocalStorage from './useLocalStorage'

// // Persistent key-value store is provided by Redis, hosted on Upstash
// // https://vercel.com/integrations/upstash
const kv = new Redis(process.env.REDIS_URL || '')
const [AccessToken, setAccessToken] = useLocalStorage<string>("AccessToken")
const [AuthToken, setAuthToken] = useLocalStorage<string>("AuthToken")

// export async function getOdAuthTokens(): Promise<{ accessToken: unknown; refreshToken: unknown }> {
//   const accessToken = await kv.get(`${siteConfig.kvPrefix}access_token`)
//   const refreshToken = await kv.get(`${siteConfig.kvPrefix}refresh_token`)

//   return {
//     accessToken,
//     refreshToken,
//   }
// }

// export async function storeOdAuthTokens({
//   accessToken,
//   accessTokenExpiry,
//   refreshToken,
// }: {
//   accessToken: string
//   accessTokenExpiry: number
//   refreshToken: string
// }): Promise<void> {
//   await kv.set(`${siteConfig.kvPrefix}access_token`, accessToken, 'EX', accessTokenExpiry)
//   await kv.set(`${siteConfig.kvPrefix}refresh_token`, refreshToken)
// }


// store token in browser session

// 从 Redis 获取访问令牌和刷新令牌，并缓存到浏览器会话中
export async function getOdAuthTokens(): Promise<{ accessToken: unknown; refreshToken: unknown }> {
  // 尝试从浏览器会话中获取缓存的令牌
  const [AccessToken, setAccessToken] = useLocalStorage<string>("accessToken")
  const [RefeshToken, setRefreshToken] = useLocalStorage<string>("refreshToken")

  // 如果缓存存在，则直接返回缓存的令牌
  if (AccessToken && RefeshToken) {
    console.log("find sessionStorage token!")
    return {
      accessToken: AccessToken, 
      refreshToken: RefeshToken,
    }
  }

  // 如果缓存不存在，则从 Redis 获取令牌
  console.log("not find cache! get it by redis")
  const accessToken = await kv.get(`${siteConfig.kvPrefix}access_token`)
  const refreshToken = await kv.get(`${siteConfig.kvPrefix}refresh_token`)

  // 将获取的令牌缓存到浏览器会话中
  // sessionStorage.setItem('accessToken', accessToken || '') // 使用空字符串作为默认值
  // sessionStorage.setItem('refreshToken', refreshToken || '') // 使用空字符串作为默认值

  setAccessToken(accessToken)
  setRefreshToken(refreshToken)


  return {
    accessToken,
    refreshToken,
  }
}

// 将访问令牌和刷新令牌存储到 Redis，并更新浏览器会话中的缓存
export async function storeOdAuthTokens({
  accessToken,
  accessTokenExpiry,
  refreshToken,
}: {
  accessToken: string
  accessTokenExpiry: number
  refreshToken: string
}): Promise<void> {
  // 将令牌存储到 Redis
  await kv.set(`${siteConfig.kvPrefix}access_token`, accessToken, 'EX', accessTokenExpiry)
  await kv.set(`${siteConfig.kvPrefix}refresh_token`, refreshToken)

  const [AccessToken, setAccessToken] = useLocalStorage<string>("accessToken")
  const [AuthToken, setRefreshToken] = useLocalStorage<string>("refreshToken")


  // 更新浏览器会话中的缓存
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)

  
}