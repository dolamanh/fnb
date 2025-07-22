// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  UserList: undefined;
  WebSocketTest: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Users: undefined;
  WebSocket: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
