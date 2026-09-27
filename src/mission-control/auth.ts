const TOKEN='mission-control.access-token',VERIFIER='mission-control.pkce-verifier'
const required=()=>import.meta.env.VITE_MC_AUTH_REQUIRED==='true'
const issuer=()=>String(import.meta.env.VITE_MC_OIDC_ISSUER||'').replace(/\/$/,'')
const clientId=()=>import.meta.env.VITE_MC_OIDC_CLIENT_ID||'mission-control-ui'
const redirectUri=()=>window.location.origin+'/mission-control'

const b64url=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
const random=()=>{const b=new Uint8Array(32);crypto.getRandomValues(b);return b64url(b)}
async function challenge(v:string){return b64url(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v))))}
function payload(token:string){try{return JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch{return null}}
export function authRequired(){return required()}
export function accessToken(){const t=sessionStorage.getItem(TOKEN);if(!t)return null;const p=payload(t);if(!p?.exp||p.exp*1000<=Date.now()+5000){sessionStorage.removeItem(TOKEN);return null}return t}
export async function beginLogin(){
 if(!required())return
 if(!issuer())throw new Error('VITE_MC_OIDC_ISSUER is required')
 const v=random();sessionStorage.setItem(VERIFIER,v)
 const q=new URLSearchParams({client_id:clientId(),redirect_uri:redirectUri(),response_type:'code',scope:'openid profile email',code_challenge:await challenge(v),code_challenge_method:'S256'})
 window.location.assign(issuer()+'/protocol/openid-connect/auth?'+q)
}
export async function completeLogin(){
 if(!required())return null
 const q=new URLSearchParams(window.location.search),code=q.get('code');if(!code)return accessToken()
 const v=sessionStorage.getItem(VERIFIER);if(!v)throw new Error('PKCE verifier missing')
 const body=new URLSearchParams({grant_type:'authorization_code',client_id:clientId(),redirect_uri:redirectUri(),code,code_verifier:v})
 const res=await fetch(issuer()+'/protocol/openid-connect/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body})
 if(!res.ok)throw new Error('OIDC token exchange failed')
 const x=await res.json();sessionStorage.setItem(TOKEN,x.access_token);sessionStorage.removeItem(VERIFIER)
 const clean=new URL(window.location.href);clean.searchParams.delete('code');clean.searchParams.delete('session_state');clean.searchParams.delete('iss');window.history.replaceState({},'',clean)
 return x.access_token as string
}
export async function ensureAccessToken(){const t=await completeLogin();if(required()&&!t){await beginLogin();throw new Error('redirecting_to_login')}return t}
export function missionRoles(){const t=accessToken();if(!t)return required()?[]:['Administrator'];const p=payload(t);return [...new Set([...(p?.realm_access?.roles||[]),...(p?.resource_access?.['mission-control']?.roles||[])])] as string[]}
