import React from 'react';
import { createRoot } from 'react-dom/client';
import './reset.css';
import './components/generated/Ladyana.css';
import './components/Admin.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Application root missing');

function StartupError({ error, retry }: { error: Error; retry: () => void }) {
  return <div style={{fontFamily:'system-ui,sans-serif',padding:32,maxWidth:520,margin:'12vh auto',color:'#392b27'}}>
    <h1>Ladyana is temporarily unavailable</h1>
    <p>We couldn't load the store. Please try again.</p>
    <button onClick={retry} style={{padding:'12px 22px',background:'#8c5c4e',color:'white',border:0,borderRadius:8}}>Try again</button>
    <details style={{marginTop:24}}><summary>Technical details</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{error.message}</pre></details>
  </div>;
}
class ErrorBoundary extends React.Component<React.PropsWithChildren, {error: Error | null}> {
  state: {error: Error | null} = {error:null};
  static getDerivedStateFromError(error: Error) { return {error}; }
  render() { return this.state.error ? <StartupError error={this.state.error} retry={()=>location.reload()}/> : this.props.children; }
}
function App() {
  const [Page,setPage] = React.useState<React.ComponentType | null>(null);
  const [error,setError] = React.useState<Error|null>(null);
  React.useEffect(()=>{
    let active=true;
    const load=async()=>{
      try {
        if(new URLSearchParams(location.hash.slice(1)).get('type')==='recovery'){history.replaceState(null,'','/account/reset'+location.hash)}
        const isAdmin=location.pathname.startsWith('/admin');
        const isAccount=location.pathname.startsWith('/account/') || new URLSearchParams(location.hash.slice(1)).has('access_token') || new URLSearchParams(location.hash.slice(1)).has('error');
        const module = isAccount ? await import('./components/AccountForm') : isAdmin ? await import('./components/AdminPanel') : await import('./components/generated/LadyanaCompleteShoppingExperience');
        if(active)setPage(()=>isAccount?module.AccountPage:isAdmin?module.AdminPanel:module.LadyanaCompleteShoppingExperience);
        if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
      } catch(e) { if(active)setError(e instanceof Error?e:new Error(String(e))); }
    };
    void load();
    return ()=>{active=false};
  },[]);
  if(error)return <StartupError error={error} retry={()=>location.reload()}/>;
  if(!Page)return <div style={{fontFamily:'system-ui',padding:32,textAlign:'center',marginTop:'20vh'}}>Loading Ladyana…</div>;
  return <Page/>;
}
createRoot(rootElement).render(<ErrorBoundary><App/></ErrorBoundary>);
