package utils

import (
	"os/user"
	"strings"
)

// Must raises an error if it not nil
func Must(e error) {
	if e != nil {
		panic(e)
	}
}

// Not raises an error if it's not true
func MustB(b bool, m string) {
	if !b {
		panic(m)
	}
}

func MapGetDefault(m map[string]interface{}, key string, d interface{}) interface{} {
	// func MapGetDefault(m map[string]string, key string, d string) string {
	if val, ok := m[key]; ok {
		return val
	}
	return d
}

func ExpandHome(path string) (string, error) {
	if !strings.HasPrefix(path, "~") {
		return path, nil
	}
	usr, err := user.Current()
	if err != nil {
		return "", err
	}
	home := usr.HomeDir

	return home + path[1:], nil
}
