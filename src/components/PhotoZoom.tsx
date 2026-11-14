import React, {useEffect, useRef, useState} from 'react';
import './PhotoZoom.css';

type View = {scale:number; x:number; y:number};
const initial: View = {scale:1,x:0,y:0};
export function PhotoZoom({src, name, onClose}:{src:string;name:string;onClose:()=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number,{x:number;y:number}>());
  const view = useRef<View>(initial);
  const [current,setCurrent] = useState(initial);
  const [failed,setFailed] = useState(false);
  function update(next:View) {
    const scale=Math.max(1,Math.min(5,next.scale));
    const width=img.current?.clientWidth||0, height=img.current?.clientHeight||0;
    const box=stage.current;
    const maxX=Math.max(0,(width*scale-(box?.clientWidth||width))/2);
    const maxY=Math.max(0,(height*scale-(box?.clientHeight||height))/2);
    view.current={scale,x:Math.max(-maxX,Math.min(maxX,next.x)),y:Math.max(-maxY,Math.min(maxY,next.y))};
    setCurrent(view.current);
  }
  function zoom(scale:number) {update({...view.current,scale});}
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.current?.showModal();
    const reset=()=>update(initial);
    window.addEventListener('resize',reset);
    return()=>{document.body.style.overflow=overflow;window.removeEventListener('resize',reset);previous?.focus();};
  },[]);
  useEffect(()=>{
    const node=stage.current;
    const wheel=(e:WheelEvent)=>{e.preventDefault();zoom(view.current.scale*Math.exp(-e.deltaY*0.002));};
    node?.addEventListener('wheel',wheel,{passive:false});
    return()=>node?.removeEventListener('wheel',wheel);
  },[]);
  function move(e:React.PointerEvent) {
    if(!pointers.current.has(e.pointerId))return;
    const before=Array.from(pointers.current.values());
    const old=pointers.current.get(e.pointerId)!;
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const after=Array.from(pointers.current.values());
    if(after.length===2){
      const distance=(p:{x:number;y:number}[])=>Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
      const oldDistance=distance(before);
      if(oldDistance>0)update({...view.current,scale:view.current.scale*distance(after)/oldDistance});
    }else if(after.length===1){update({...view.current,x:view.current.x+e.clientX-old.x,y:view.current.y+e.clientY-old.y});}
  }
  return <dialog ref={dialog} className="photo-zoom" aria-label={'Zoom photo: '+name} onCancel={onClose}>
    <div className="photo-zoom-toolbar"><span>{name}</span><button autoFocus onClick={onClose} aria-label="Close zoom">✕</button></div>
    <div ref={stage} className="photo-zoom-stage" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});}} onPointerMove={move} onPointerUp={e=>pointers.current.delete(e.pointerId)} onPointerCancel={e=>pointers.current.delete(e.pointerId)} onLostPointerCapture={e=>pointers.current.delete(e.pointerId)} onDoubleClick={()=>zoom(view.current.scale>1?1:3)}>
      {failed?<p>Photo could not load. Close and try again.</p>:<img ref={img} src={src} alt={name} draggable={false} onError={()=>setFailed(true)} style={{transform:`translate(${current.x}px,${current.y}px) scale(${current.scale})`}}/>}
    </div>
    <div className="photo-zoom-controls"><button aria-label="Zoom out" disabled={current.scale<=1} onClick={()=>zoom(current.scale-0.5)}>−</button><output aria-label="Zoom level">{Math.round(current.scale*100)}%</output><button aria-label="Zoom in" disabled={current.scale>=5} onClick={()=>zoom(current.scale+0.5)}>+</button><button onClick={()=>update(initial)}>Reset</button></div>
    <p className="photo-zoom-hint">Pinch or use + to zoom. Drag to inspect details.</p>
  </dialog>;
}
