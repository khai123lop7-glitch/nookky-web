import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
OUT="/home/user/nookky-web/docs/report/charts/"
BLUE="#2a78d6"; ORANGE="#eb6834"; GRAY="#b5b3ad"; INK="#0b0b0b"; INK2="#52514e"; SURF="#ffffff"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.edgecolor":"#d6d5d0","axes.labelcolor":INK2,
 "xtick.color":INK2,"ytick.color":INK2,"axes.spines.top":False,"axes.spines.right":False,"axes.titlesize":11,
 "axes.titleweight":"bold","axes.titlecolor":INK,"axes.titlelocation":"left","figure.dpi":200})
def vn(x,d=1): return f"{x:,.{d}f}".replace(",","X").replace(".",",").replace("X",".")
def grid(ax,axis="y"):
    ax.grid(axis=axis,color="#ecebe7",linewidth=0.8); ax.set_axisbelow(True)
def bar_labels(ax,bars,fmt,horiz=False,color=INK):
    box=dict(facecolor="white",edgecolor="none",pad=0.4)
    for b in bars:
        v=b.get_width() if horiz else b.get_height()
        if horiz: ax.annotate(fmt(v),(v,b.get_y()+b.get_height()/2),xytext=(5,0),textcoords="offset points",va="center",ha="left",fontsize=9,color=color,bbox=box,zorder=5)
        else: ax.annotate(fmt(v),(b.get_x()+b.get_width()/2,v),xytext=(0,4),textcoords="offset points",ha="center",va="bottom",fontsize=9,color=color,bbox=box,zorder=5)
from matplotlib.ticker import FuncFormatter
VNF=FuncFormatter(lambda x,_: (f"{x:g}").replace(".",","))
def fixfmt(fig):
    for a in fig.axes:
        for ax_ in (a.xaxis,a.yaxis):
            if type(ax_.get_major_formatter()).__name__=="ScalarFormatter": ax_.set_major_formatter(VNF)
# H1 weekly small multiples
wk=["01-07/10","08-14/10","15-21/10","22-25/10\n(4 ngày)"]
spd=[709/7,867/7,1035/7,673/4+1e-9]; opd=[9/7,13/7,19/7,11/4]
fig,axs=plt.subplots(1,2,figsize=(8,3.1))
for ax,vals,t,d in [(axs[0],spd,"Sessions trung bình/ngày",1),(axs[1],opd,"Đơn đặt trung bình/ngày",2)]:
    bs=ax.bar(wk,vals,color=BLUE,width=0.6); bar_labels(ax,bs,lambda v:vn(v,d)); ax.set_title(t); grid(ax)
    ax.set_ylim(0,max(vals)*1.18); ax.tick_params(axis="x",labelsize=8.5)
fig.tight_layout(); fixfmt(fig); fig.savefig(OUT+"h1_tuan.png"); plt.close()

# H2 channels
ch=["Direct","Organic Search","Organic Social","Paid Social","Referral","Email","Unassigned"]
ss=[972,820,650,483,205,96,58]; od=[12,19,7,8,3,3,0]
rate=[o/s*100 for o,s in zip(od,ss)]
fig,axs=plt.subplots(1,2,figsize=(8,3.4),sharey=True)
y=list(range(len(ch)))[::-1]
cols=[ORANGE if c=="Organic Search" else BLUE for c in ch]
b=axs[0].barh(y,ss,color=cols,height=0.62); bar_labels(axs[0],b,lambda v:vn(v,0),True); axs[0].set_title("Sessions theo kênh")
axs[0].set_yticks(y); axs[0].set_yticklabels(ch); axs[0].set_xlim(0,1180); grid(axs[0],"x")
b=axs[1].barh(y,rate,color=cols,height=0.62); bar_labels(axs[1],b,lambda v:vn(v,2)+"%",True); axs[1].set_title("Tỉ lệ đặt đơn/session")
axs[1].axvline(52/3284*100,color=INK2,linewidth=1,linestyle="--"); axs[1].text(52/3284*100,6.55,"TB 1,58%",fontsize=8,color=INK2,ha="left")
axs[1].set_xlim(0,3.9); grid(axs[1],"x")
fig.tight_layout(); fixfmt(fig); fig.savefig(OUT+"h2_kenh.png"); plt.close()

# H3 device
fig,axs=plt.subplots(1,3,figsize=(8,2.9))
dev=["Mobile","Desktop"]
for ax,vals,t,d,suf in [(axs[0],[65.8,33.4],"Tỉ trọng sessions",1,"%"),(axs[1],[55.8,69.8],"Engagement rate",1,"%"),(axs[2],[1.43,1.82],"Tỉ lệ đặt đơn/session",2,"%")]:
    bs=ax.bar(dev,vals,color=[BLUE,ORANGE],width=0.55); bar_labels(ax,bs,lambda v,d=d,s=suf:vn(v,d)+s); ax.set_title(t,fontsize=10); grid(ax); ax.set_ylim(0,max(vals)*1.2)
fig.tight_layout(); fixfmt(fig); fig.savefig(OUT+"h3_thietbi.png"); plt.close()

# H4 landing
lp=["/ (trang chủ)","/shop","6 trang sản phẩm","/collections","/about","/studio","/blog và URL khác","/cart, /checkout"]
lv=[1390,671,710,245,108,71,59,30]
order=sorted(range(len(lp)),key=lambda i:lv[i])
fig,ax=plt.subplots(figsize=(8,3.2))
b=ax.barh([lp[i] for i in order],[lv[i]/3284*100 for i in order],color=[ORANGE if lp[i].startswith("/ (") else BLUE for i in order],height=0.62)
for bb,i in zip(b,order): ax.text(bb.get_width(),bb.get_y()+bb.get_height()/2,f" {vn(lv[i]/3284*100,1)}% ({vn(lv[i],0)})",va="center",fontsize=9,color=INK)
ax.set_xlim(0,52); grid(ax,"x"); ax.set_xlabel("% sessions")
fig.tight_layout(); fixfmt(fig); fig.savefig(OUT+"h4_landing.png"); plt.close()

# H5 funnel
st=["Truy cập","Xem danh mục","Xem chi tiết","Thêm giỏ","Xem giỏ","Bắt đầu checkout","Đặt đơn","Đã thu tiền"]
sv=[3284,1976,1461,267,239,148,52,35]
nxt=[None]+[sv[i]/sv[i-1]*100 for i in range(1,len(sv))]
fig,ax=plt.subplots(figsize=(8,3.8))
y=list(range(len(st)))[::-1]
cols=[ORANGE if s in ("Thêm giỏ","Đặt đơn") else BLUE for s in st]
b=ax.barh(y,sv,color=cols,height=0.65)
for bb,v,n in zip(b,sv,nxt):
    lab=f" {vn(v,0)}" + ("" if n is None else f"   (đi tiếp {vn(n,1)}%)")
    ax.text(bb.get_width(),bb.get_y()+bb.get_height()/2,lab,va="center",fontsize=9,color=INK)
ax.set_yticks(y); ax.set_yticklabels(st); ax.set_xlim(0,4300); grid(ax,"x")

fig.tight_layout(); fixfmt(fig); fig.savefig(OUT+"h5_pheu.png"); plt.close()

# H6 products
pr=["Hội An","Hà Nội","Huế","Sài Gòn","Đà Lạt","Miền Tây"]
pv=[845,623,485,337,306,198]; pa=[112,76,57,38,30,15]
fig,axs=plt.subplots(1,2,figsize=(8,3.0),sharey=True)
y=list(range(len(pr)))[::-1]
b=axs[0].barh(y,pv,color=BLUE,height=0.6); bar_labels(axs[0],b,lambda v:vn(v,0),True); axs[0].set_title("Lượt xem sản phẩm (view_item)")
axs[0].set_yticks(y); axs[0].set_yticklabels(pr); axs[0].set_xlim(0,1050); grid(axs[0],"x")
r=[a/v*100 for a,v in zip(pa,pv)]
b=axs[1].barh(y,r,color=BLUE,height=0.6); bar_labels(axs[1],b,lambda v:vn(v,1)+"%",True); axs[1].set_title("add_to_cart / view_item")
axs[1].axvline(328/2794*100,color=INK2,linewidth=1,linestyle="--"); axs[1].text(328/2794*100,5.5,"TB 11,7%",fontsize=8,color=INK2)
axs[1].set_xlim(0,16.5); grid(axs[1],"x")
fig.tight_layout(); fixfmt(fig); fig.savefig(OUT+"h6_sanpham.png"); plt.close()
print("ok")
