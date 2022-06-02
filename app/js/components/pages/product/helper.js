export default function checkPosition(place, store, idSmall) {
    if (store.placeStatus === "IN_FACTORY" && store.current.owner === idSmall) {
        let text = "Kho trực thuộc : " + store.current.name;
        return text;
    }
    if (store.placeStatus === "IN_FACTORY" && store.current.owner !== idSmall) {
        let text = "Tại: " + store.current.name;
        return text;
    }
    else if (store.placeStatus === "IN_REPAIR") {
        let index = place.findIndex(p => p.key === store.placeStatus);
        return place[index].value + ": " + store.current.name;
    }
    else if (store.placeStatus === "IN_GENERAL") {
        //let index = place.findIndex(p => p.key === store.placeStatus);
        //return place[index].value + ": " + store.current.name;
        return store.current.name;
    }
    else if(store.placeStatus === "IN_AGENCY"){
        if (store.current.isChildOf_name){
            return store.current.isChildOf_name + " - "+ store.current.name
        }
       return store.current.name;
    }
    else {
        let index = place.findIndex(p => p.key === store.placeStatus);
        return place[index].value;
    }
}