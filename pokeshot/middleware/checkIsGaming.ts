import { Middleware } from '@nuxt/types'
import store from '@/store/store'

const checkIsGaming: Middleware = ({ redirect }) => {
  if (!store.state.game.getIsGaming) {
    redirect('/');
  } 
}

export default checkIsGaming