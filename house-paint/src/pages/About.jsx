import logo from "../assets/images/Si Thu Paint.jpeg";
export default function About() {
  return (
    <section className="container-fluid">
      <h1 className="pt-4">About Us</h1>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <img src={logo} alt="" />
        </div>
        <div className="col-md-6">
          <h1>Since 2020</h1>
          <div>
            Si Thu House Paint ဆိုင်က ရပ်တည် လာတာ လေးနှစ် တိုင်တိုင် ရှိပါပြီး။
            မိတ်ဟောင်း၊ မိတ်သစ် ဝယ်သူအားပေးသူများ ကို လဲ အထူးကျေးဇူးတင်ရှိပါတယ်။
            <br />
            UPG ဆေးဘူးများကို ပစ္စည်းမှန် ဈေးနှုန်းမှန် နဲ့ရောင်းချပေးနေပါသည်။
          </div>
          <br />
          <h1>Decoration</h1>
          <div>
            အိမ်လုံးချင်း၊ နှစ်ထပ် များဆောက်လုပ်ခြင်း
            <br />
            အိမ်ခန်း၊ ဆိုင်ခန်းဖွဲ့စည်းခြင်း
            <br />
            အတွင်းအပြင်အလှဆင်ခြင်း များကို လူကြီးမင်းတို့စိတ်တိုင်းကျ
            ညှိနှိုင်းဆောင်ရွက်ပေးနေပါသည်။
          </div>
        </div>
      </div>
    </section>
  );
}
