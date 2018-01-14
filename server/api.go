package main

import (
	"time"

	. "github.com/ant1441/kube-webview/server/utils"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"

	"github.com/labstack/echo"
	"github.com/olebedev/config"
)

// API is a defined as struct bundle
// for api. Feel free to organize
// your app as you wish.
type API struct {
	k8sClientset *kubernetes.Clientset
}

func NewAPI(conf *config.Config) (*API, error) {
	kConf := conf.UMap("kubernetes", map[string]interface{}{
		"master":     "localhost",
		"kubeconfig": "~/.kube/config",
	})
	master, ok := MapGetDefault(kConf, "master", "localhost").(string)
	MustB(ok, "Unable to get kubernetes master url")
	kubeconfig, ok := MapGetDefault(kConf, "kubeconfig", "~/.kube/config").(string)
	MustB(ok, "Unable to get kubeconfig path")
	kubeconfig, err := ExpandHome(kubeconfig)
	Must(err)
	kubeTimeoutS, ok := MapGetDefault(kConf, "timeout", "5s").(string)
	MustB(ok, "Unable to get kubernetes timeout")

	config, err := clientcmd.BuildConfigFromFlags(master, kubeconfig)
	if err != nil {
		return nil, err
	}
	kubeTimeout, err := time.ParseDuration(kubeTimeoutS)
	Must(err)
	config.Timeout = kubeTimeout

	// creates the clientset
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}

	return &API{
		k8sClientset: clientset,
	}, nil
}

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	group.GET("/v1/conf", api.ConfHandler)
	group.GET("/v1/nodes", api.NodesHandler)
	group.GET("/v1/namespaces", api.NamespacesHandler)
	group.GET("/v1/pods", api.PodsHandler)
	group.GET("/v1/services", api.ServicesHandler)
}

// ConfHandler handle the app config, for example
func (api *API) ConfHandler(c echo.Context) error {
	app := c.Get("app").(*App)
	return c.JSON(200, app.Conf.Root)
}

// NodesHandler fetches the list of k8s nodes
func (api *API) NodesHandler(c echo.Context) error {
	nodes, err := api.k8sClientset.CoreV1().Nodes().List(metav1.ListOptions{})
	if err != nil {
		return c.JSON(500, struct {
			Error   error
			Message string
		}{
			Error:   err,
			Message: "Couldn't fetch Nodes",
		})
	}

	return c.JSON(200, nodes)
}

// NamespacesHandler fetches the list of k8s nodes
func (api *API) NamespacesHandler(c echo.Context) error {
	namespaces, err := api.k8sClientset.CoreV1().Namespaces().List(metav1.ListOptions{})
	if err != nil {
		return c.JSON(500, struct {
			Error   error
			Message string
		}{
			Error:   err,
			Message: "Couldn't fetch Namespaces",
		})
	}

	return c.JSON(200, namespaces)
}

// PodsHandler fetches the list of k8s nodes
func (api *API) PodsHandler(c echo.Context) error {
	namespace := c.QueryParam("namespace")
	pods, err := api.k8sClientset.CoreV1().Pods(namespace).List(metav1.ListOptions{})
	if err != nil {
		return c.JSON(500, struct {
			Error   error
			Message string
		}{
			Error:   err,
			Message: "Couldn't fetch Pods",
		})
	}

	return c.JSON(200, pods)
}

// ServicesHandler fetches the list of k8s nodes
func (api *API) ServicesHandler(c echo.Context) error {
	namespace := c.QueryParam("namespace")
	pods, err := api.k8sClientset.CoreV1().Services(namespace).List(metav1.ListOptions{})
	if err != nil {
		return c.JSON(500, struct {
			Error   error
			Message string
		}{
			Error:   err,
			Message: "Couldn't fetch Services",
		})
	}

	return c.JSON(200, pods)
}
