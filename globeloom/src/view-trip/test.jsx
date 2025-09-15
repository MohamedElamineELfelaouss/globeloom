const stateInitial = {
    project : []
}

const reducerProject = (state = stateInitial,action)=>{
    switch(action.type){
        case 'getProject':
            return {
                ...state
            }
        case 'addProject':
            return {
                ...state,
                projects:[...state.projects,action.payload]
            }
        case "deleteProject":
            return {
                ...state,
                projects:state.projects.map((project)=>project.id === action.payload.id ? action.payload: project)
            }
    }
}