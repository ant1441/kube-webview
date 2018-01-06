package main

import (
	"os"

	"github.com/codegangsta/cli"
)

func main() {
	// defer profile.Start(profile.CPUProfile, profile.ProfilePath(".")).Stop()
	Run(os.Args)
}

// Run creates, configures and runs
// main cli.App
func Run(args []string) {
	app := cli.NewApp()
	app.Name = "kube-webview"
	app.Usage = "kubernetes web view"

	app.Commands = []cli.Command{
		{
			Name:   "run",
			Usage:  "Runs server",
			Action: RunServer,
		},
	}
	app.Run(args)
}

// RunServer creates, configures and runs
// main server.App
func RunServer(c *cli.Context) {
	app := NewApp(AppOptions{})
	app.Run()
}
