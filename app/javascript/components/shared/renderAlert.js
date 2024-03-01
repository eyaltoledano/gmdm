import { toast } from "react-hot-toast";

const renderAlert = (type, message, duration = 3000, padding = '16px') => {
        switch (type) {
            case 'error':
                return toast.error(message, {
                    style: {
                        border: '1px solid #FFA3D4',
                        padding: `${padding}`,
                        color: '#FFA3D4',
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
                          zIndex: 9999,
                      },
                      iconTheme: {
                          primary: '#FFA3D4',
                          secondary: '#FFFFFF',
                      },
                      duration: duration,
                  });
            case 'info':
                case 'loading':
                  return toast.loading(message, {
                      style: {
                          border: '1px solid #FFA3D4',
                          padding: '16px',
                          color: '#FFA3D4',
                          zIndex: 9999,
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
                        zIndex: 9999,
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