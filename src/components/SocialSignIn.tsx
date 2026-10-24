import React, {useEffect, useState} from 'react';
import {supabase, supabaseKey, supabaseUrl} from '../supabase';
import './SocialSignIn.css';

const providers = [{id:'google',name:'Google'}, {id:'facebook',name:'Facebook'}, {id:'apple',name:'Apple'}] as const;
type Provider = typeof providers[number]['id'];

export function SocialSignIn({busy,onBusy,onMessage}:{busy:boolean;onBusy:(value:boolean)=>void;onMessage:(value:string)=>void}) {
  const [enabled,setEnabled] = useState<Partial<Record<Provider,boolean>> | null>(null);
  const [failed,setFailed] = useState(false);
  const [retry,setRetry] = useState(0);
  useEffect(()=>{
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(),10000);
    let active = true;
    setFailed(false); setEnabled(null);
    fetch(`${supabaseUrl}/auth/v1/settings`,{headers:{apikey:supabaseKey},signal:controller.signal,cache:'no-store'})
      .then(async response=>{if(!response.ok)throw Error();return response.json()})
      .then(settings=>{if(active)setEnabled(Object.fromEntries(providers.map(p=>[p.id,settings.external?.[p.id]===true])))})
      .catch(()=>{if(active)setFailed(true)})
      .finally(()=>clearTimeout(timer));
    return()=>{active=false;clearTimeout(timer);controller.abort()};
  },[retry]);

  async function signIn(provider:Provider) {
    if(!enabled?.[provider] || busy)return;
    onBusy(true); onMessage('Opening secure sign-in…');
    try {
      const redirectTo = location.origin + (location.pathname.startsWith('/admin')?'/admin':'/?account=1');
      const {error} = await supabase.auth.signInWithOAuth({provider,options:{redirectTo}});
      if(error)throw error;
    } catch {
      onMessage('Unable to start sign-in. Please try again or use email.');
    } finally {onBusy(false)}
  }

  return <div className="social-signin">
    <p>Create an account or sign in with your existing account.</p>
    <div className="social-buttons">
      {providers.map(p=><button key={p.id} type="button" disabled={busy || !enabled?.[p.id]} onClick={()=>void signIn(p.id)}>
        <span>Continue with {p.name}</span>
        {enabled && !enabled[p.id] && <small>Coming soon</small>}
      </button>)}
    </div>
    {!enabled && !failed && <p role="status">Checking sign-in options…</p>}
    {failed && <p role="status">Social sign-in is temporarily unavailable. <button type="button" className="text-link" onClick={()=>setRetry(n=>n+1)}>Retry</button></p>}
  </div>;
}
