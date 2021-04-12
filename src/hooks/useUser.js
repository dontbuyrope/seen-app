import { watchEffect } from 'vue';
import {useStore} from "vuex"
import { UserService } from "@/services/apiService"
import useWeb3 from "@/connectors/hooks"

export default function useUser() {
  const store = useStore();
  const {account} = useWeb3();

  const fetchUser = async () => {
    try {
      const {data} = await UserService.get(account.value);
      store.dispatch('user/setUser', data ? data.user : null);
    } catch (err) {
      return;
    }
    
  }

  watchEffect(() => {
    if (account.value) {
      fetchUser();
    }
  })

  return {
    fetchUser
  };
}