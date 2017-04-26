import axios from "axios";
import serverDetails from "../apiDetails";

export function fetchUser(userDetails) {
    return function(dispatch) {
        axios.post("http://localhost:3001/api/user/login", {
                name: userDetails.name,
                password: userDetails.password
            })
            .then((response) => {
                dispatch({
                    type: "USER_LOGIN_FULFILLED",
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: "USER_LOGIN_REJECTED",
                    payload: err
                })
            })
    }
}

export function fetchUsers() {
    return function(dispatch) {
        axios.get(serverDetails.baseUrl + '/users')
            .then((response) => {
                console.log(response);
                dispatch({
                    type: 'FETCH_USERS_FULFILLED',
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: "FETCH_USERS_REJECTED",
                    payload: err
                })
            })
    }
}
