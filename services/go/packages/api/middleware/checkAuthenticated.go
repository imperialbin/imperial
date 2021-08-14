package middlware

import . "api/utils"

func checkAuthenticated(session string) bool {
	_, ok := RedisGet(session)
	if !ok {
		return false
	}

	return true
}
