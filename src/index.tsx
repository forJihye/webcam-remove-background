import './index.css';
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { assetsLoad } from './store/utils';
import assetsConfig from './assets.config';
import assets from './store/assets';
import store from './store';

const main = async () => {
  await assetsLoad(assetsConfig);
  console.log('assets', assets);

  ReactDOM.render(<BrowserRouter> 
    <App assets={assets} store={store} /> 
  </BrowserRouter>, document.getElementById("root")
  );
}
main()

