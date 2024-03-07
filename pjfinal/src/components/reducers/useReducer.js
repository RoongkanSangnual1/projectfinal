export function userReducer(state=null,action){

    // eslint-disable-next-line default-case
    switch(action.type){
        case "LOGIN":
            return action.payload;  
        case "LOGOUT":
            return "555 logout"   
         case "email":
                return action.payload;  
        case "OTP":
                return action.payload;         
        default:
            return state;
    }
}