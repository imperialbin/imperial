package utils

func ArrayContains(array []string, str string) bool {
	for _, item := range array {
		if item == str {
			return true
		}
	}
	return false
}
