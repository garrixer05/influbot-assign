export const processEvents = (newEv, prevEv)=>{
    let res = {
        flag:null,
        ev:null
    }
    if(newEv.length > prevEv.length){
        res.flag = true;
        res.ev = findExtra(newEv, prevEv);
    }else if(newEv.length < prevEv.length){
        res.flag = false;
        res.ev = findExtra(prevEv, newEv);
    }
    return res;
}

const findExtra = (a, b)=>{
    let ex={};
    for (let i = 0; i<a.length; i++){
        if ( b.find(el=>el.id === a[i].id)===undefined ){
            ex=a[i];
            break
        }
    }
    return ex;
}