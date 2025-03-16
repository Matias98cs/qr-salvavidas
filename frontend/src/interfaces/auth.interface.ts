export interface AuthResponse {
    refresh: string;
    access:  string;
    user:    User;
}

export interface User {
    id:         number;
    username:   string;
    email:      string;
    dni:        string;
    role:       string;
    first_name: string;
    last_name:  string;
}

export interface AuthRefreshResponse {
    access:  string;
    refresh: string;
    user:    User;
}
