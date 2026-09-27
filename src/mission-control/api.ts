import { accessToken,ensureAccessToken } from './auth'
export const MC_API=import.meta.env.VITE_MC_API_BASE_URL||'http://127.0.0.1:8790'
export async function mcFetch(path:string,init:RequestInit={}){
 await ensureAccessToken();const token=accessToken();const headers=new Headers(init.headers);if(token)headers.set('Authorization','Bearer '+token)
 const res=await fetch(MC_API+path,{...init,headers});if(res.status===401){sessionStorage.removeItem('mission-control.access-token');throw new Error('authentication_required')}return res
}
export async function mcJson(path:string){const r=await mcFetch(path);if(!r.ok)throw new Error('Mission Control API '+r.status);return r.json()}
