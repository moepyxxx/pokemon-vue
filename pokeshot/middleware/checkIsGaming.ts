import { Middleware } from '@nuxt/types'
import store from '@/store/store'

const checkIsGaming: Middleware = ({ redirect }) => {
  const isGaming = store.state.game.game.gaming;
  
  if (!isGaming) {
    redirect('/');
  } 
}

export default checkIsGaming