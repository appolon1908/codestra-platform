import { accessToken,ensureAccessToken } from './auth'
export type RealtimeStatus='connecting'|'connected'|'reconnecting'|'offline'
export function connectRealtime(onEvent:(x:any)=>void,onStatus:(s:RealtimeStatus)=>void){
 let stopped=false,ws:WebSocket|null=null,attempt=0,timer:number|undefined
 const open=async()=>{if(stopped)return;onStatus(attempt?'reconnecting':'connecting');try{await ensureAccessToken()}catch{return}
  const token=accessToken(),protocols=['mission-control'];if(token)protocols.push('bearer.'+token)
  ws=new WebSocket(import.meta.env.VITE_MC_WS_URL||'ws://127.0.0.1:8791',protocols)
  ws.onopen=()=>{attempt=0;onStatus('connected')}
  ws.onmessage=e=>{try{onEvent(JSON.parse(e.data))}catch{}}
  ws.onclose=()=>{if(stopped)return;onStatus('reconnecting');const delay=Math.min(15000,500*2**Math.min(attempt++,5));timer=window.setTimeout(open,delay)}
  ws.onerror=()=>ws?.close()
 }
 void open();return()=>{stopped=true;if(timer)clearTimeout(timer);ws?.close()}
}
