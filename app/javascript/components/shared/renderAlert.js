import { toast } from "react-hot-toast";

const renderAlert = (type, message, duration = 3000, padding = '16px') => {
        switch (type) {
            case 'error':
                return toast.error(message, {
                    style: {
                        border: '1px solid #FFA3D4',
                        padding: `${padding}`,
                        color: '#FFA3D4',
                        borderRadius: '10px',
                        zIndex: 9999,
                    },
                    iconTheme: {
                        primary: '#FFA3D4',
                        secondary: '#FFFFFF',
                    },
                    duration: duration,
                });
            case 'loading':
                  return toast.loading(message, {
                      style: {
                          border: '1px solid #FFA3D4',
                          padding: '16px',
                          color: '#FFA3D4',
                          borderRadius: '10px',
                          zIndex: 9998,
                      },
                      iconTheme: {
                          primary: '#FFA3D4',
                          secondary: '#FFFFFF',
                      },
                      duration: duration,
                  });
            case 'info':
                  return toast(message, {
                      style: {
                          border: '1px solid #FFA3D4',
                          padding: '16px',
                          color: '#FFA3D4',
                          borderRadius: '10px',
                          zIndex: 9992,
                      },
                      iconTheme: {
                          primary: '#FFA3D4',
                          secondary: '#FFFFFF',
                      },
                      duration: duration,
                  });
                case 'dark':
                return toast(message, {
                    style: {
                        border: '1px solid #FFA3D4',
                        padding: '16px',
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        zIndex: 9995,
                    },
                    iconTheme: {
                        primary: '#FFA3D4',
                        secondary: '#FFFFFF',
                    },
                    duration: duration,
                });
            default:
                return toast.success(message, {
                    style: {
                        border: '1px solid #FFA3D4',
                        padding: '16px',
                        color: '#FFA3D4',
                        borderRadius: '10px',
                        zIndex: 9990,
                    },
                    iconTheme: {
                        primary: '#FFA3D4',
                        secondary: '#FFFFFF',
                    },
                    duration: duration,
                });
        }
      }

export default renderAlert;