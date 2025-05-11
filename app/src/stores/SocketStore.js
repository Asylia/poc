import {ref, computed} from 'vue';
import {defineStore} from 'pinia';
import {io} from "socket.io-client";
import {useUserStore} from "@/stores/UserStore";

export const SOCKET_STATUS = {
    NONE: 'NONE', // should not ever happen
    AUTH_ERROR: 'AUTH_ERROR',
    CONNECTED: 'CONNECTED',
    CONNECTING: 'CONNECTING',
    RECONNECTING: 'RECONNECTING',
    DISCONNECTED: 'DISCONNECTED'
}

const SHOW_RECONNECT_WARNING_AFTER = 5;
const SHOW_RECONNECT_LOADING = 5;
let socket = null;

export const useSocketStore = defineStore('SocketStore', () => {
    // stores
    const userStore = useUserStore();  // store instance
    // states
    // const socket = ref(null);
    const connected = ref(false);
    const connecting = ref(true);
    const reconnecting = ref(false);
    const hasAuthError = ref(false);
    const reconnectAttempts = ref(0);

    const showReconnectWarning = computed(() => socketStatus.value === SOCKET_STATUS.RECONNECTING && reconnectAttempts.value < SHOW_RECONNECT_WARNING_AFTER)

    const isConnecting = computed(() => {
        if (socketStatus.value === SOCKET_STATUS.CONNECTING) return true;
        if (socketStatus.value === SOCKET_STATUS.RECONNECTING) return reconnectAttempts.value > SHOW_RECONNECT_WARNING_AFTER;
        return false
    })

    const socketIsDisconnectedError = computed(() => {

        if (socketStatus.value === SOCKET_STATUS.DISCONNECTED && reconnecting.value) {
            return reconnectAttempts.value > SHOW_RECONNECT_LOADING
        }

        return [SOCKET_STATUS.AUTH_ERROR, SOCKET_STATUS.NONE].includes(socketStatus.value)

    })


    const socketStatus = computed(() => {
        if (hasAuthError.value) return SOCKET_STATUS.AUTH_ERROR;
        if (connected.value) return SOCKET_STATUS.CONNECTED;
        if (connecting.value) return SOCKET_STATUS.CONNECTING;
        if (reconnecting.value) return SOCKET_STATUS.RECONNECTING;
        return SOCKET_STATUS.DISCONNECTED;  // default case
    })

    /*
     * Socket hooks
     */
    const socketHooks = {
        'id': {
            'onConnect': () => {
            },
            'onDisconnect': () => {
            }
        }
    }

    const addHook = ({id, onConnect, onDisconnect}) => {

        if (socketHooks[id]) {
            return;
        }

        socketHooks[id] = {
            onConnect,
            onDisconnect
        }

        if (connected.value) {
            onConnect(socket)
        }

    }

    const removeHook = (id) => {
        if (!socketHooks[id]) {
            return;
        }
        socketHooks[id].onDisconnect(socket)
        delete socketHooks[id]
    }

    const emitEvent = (event, data) => {
        socket.emit(event, data);
    }

    const initSocket = async () => {
        connecting.value = true;
        const {data, error} = await userStore.getAccessToken();

        if (error) {
            hasAuthError.value = true;
            connecting.value = false;
            return;
        }

        hasAuthError.value = false;

        // socket = io("http://localhost:7001", {
        socket = io(import.meta.env.VITE_API_URL, {
            auth: {token: data},
            // forceNew: false,
            forceNew: true,
            path: "/socket",
            transports: ['websocket'],
            reconnection: true,
            autoConnect: true,
            reconnectionDelay: 500,
        });

        socket.on("connect", () => {
            connected.value = true;
            reconnecting.value = false;
            connecting.value = false;

            const hookKeys = Object.keys(socketHooks);
            for (let i = 0; i < hookKeys.length; i++) {
                const hook = socketHooks[hookKeys[i]]
                if (hook.onConnect) hook.onConnect(socket)
            }

            // startListenForStoredListeners()
            // callback()
        })

        socket.on('reconnect_attempt', () => {
            reconnecting.value = true
        })

        socket.io.on("reconnect_error", (error) => {
            reconnectAttempts.value += 1;
            reconnecting.value = true
            connected.value = false
        })

        socket.on('reconnect', (attemptNumber) => {
            connected.value = true
            reconnecting.value = false
        })

        socket.on('disconnect', (reason) => {

            setTimeout(() => {
                const hookKeys = Object.keys(socketHooks);
                for (let i = 0; i < hookKeys.length; i++) {
                    const hook = socketHooks[hookKeys[i]]
                    if (hook.onDisconnect) hook.onDisconnect(socket)
                }

                connected.value = false;
            }, 3000)
        })
    }

    const destroySocket = () => {
        if (socket) {
            // removeAllListeners(true);
            socket.disconnect();
            socket = null;
        }
    }

    const getSocket = () => socket

    return {
        isConnecting,
        // socket,
        connecting,
        reconnecting, // Expose reconnecting status
        hasAuthError,
        socketStatus,
        socketIsDisconnectedError,
        reconnectAttempts,
        showReconnectWarning,
        getSocket,
        addHook,
        removeHook,
        // addListener,
        // removeListener,
        // removeAllListeners,
        initSocket,
        destroySocket,
        emitEvent
    };
})