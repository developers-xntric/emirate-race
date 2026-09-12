import json, pathlib
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
out=root/"artifacts"/"home"
out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r"C:\Users\HP\AppData\Local\ms-playwright\chromium-1187\chrome-win\chrome.exe",headless=True)
    page=browser.new_page(viewport={"width":1920,"height":1080},device_scale_factor=1,reduced_motion="reduce")
    page.goto("http://localhost:3000",wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    for name, src in [("hero","/home/hero-video.webm"),("about","/home/about-section-video.webm")]:
        encoded=page.evaluate("""async (src) => { const v=document.createElement('video');v.muted=true;v.src=src;v.preload='auto'; await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=reject;}); const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg',0.9).split(',')[1]; }""",src)
        import base64
        (root/"public"/"home"/(name+"-poster.jpg")).write_bytes(base64.b64decode(encoded))
    page.reload(wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    results=[]
    errors=[]
    page.on("pageerror",lambda error: errors.append(str(error)))
    for width in [1920,1440,1024,768,390,320]:
        page.set_viewport_size({"width":width,"height":1080 if width>768 else 844})
        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(500)
        # Force lazy image loading before screenshot.
        for image in page.locator("img").all():
            image.evaluate("(img)=>img.loading='eager'")
        page.wait_for_timeout(1200)
        metrics=page.evaluate("""() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),overflow:[...document.querySelectorAll('h1,h2,h3,p,article,nav')].filter(e=>e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left< -1).map(e=>({tag:e.tagName,text:e.textContent.slice(0,50),x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width}))})""")
        results.append(metrics)
        if width in [1920,1440,390,320]: page.screenshot(path=str(out/(str(width)+".png")),full_page=True)
    page.set_viewport_size({"width":390,"height":844})
    page.get_by_role("button",name="Open navigation").click()
    results.append({"mobileMenuVisible":page.get_by_role("navigation",name="Mobile navigation",exact=True).is_visible()})
    page.get_by_role("navigation",name="Mobile navigation",exact=True).get_by_role("link",name="About EVRS").click()
    results.append({"mobileMenuClosed":page.get_by_role("navigation",name="Mobile navigation",exact=True).count()==0})
    page.locator("summary").first.click()
    results.append({"faqOpens":page.locator("details").first.get_attribute("open") is not None})
    results.append({"runtimeErrors":errors})
    (out/"checks.json").write_text(json.dumps(results,indent=2))
    print(json.dumps(results,indent=2))
    browser.close()
