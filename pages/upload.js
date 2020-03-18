import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie';

import VideoUploadForm from '../components/VideoUploadForm'

function Uploader() {
  const router = useRouter()
  const [cookies, setCookie] = useCookies(['video']);

  const onClickHandler = originFile => {
    setCookie('video', originFile.split("/").pop(), { path: '/' });
    router.push('/layout')
  }

  return (
    <div>
        <VideoUploadForm onClickHandler={onClickHandler} />
    </div>
  )
}

export default Uploader