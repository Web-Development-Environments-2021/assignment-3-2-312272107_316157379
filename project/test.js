try{
    throw new Error();
}
catch(error){
    if(error instanceof String){
        console.log('string');
    }
    else{
        console.log(typeof error);
    }
}
