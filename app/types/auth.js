// @flow
import * as actionTypes from '../actions/actionTypes/auth';


export type AuthAction =
  {|
    type: typeof actionTypes.LOGIN_REQUEST,
    payload: {|
      host: string,
      username: string,
      password: string,
    |},
  |} |
  {|
    type: typeof actionTypes.LOGIN_OAUTH_REQUEST,
    host: string,
  |} |
  {|
    type: typeof actionTypes.LOGOUT_REQUEST,
  |} |
  {|
    type: typeof actionTypes.ACCEPT_OAUTH,
    code: string,
  |} |
  {|
    type: typeof actionTypes.DENY_OAUTH,
  |};
