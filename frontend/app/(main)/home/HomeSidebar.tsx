function HomeSidebar() {
  return (
    <section className="w-full min-h-screen bg-slate-200 text-black py-8 px-6 flex flex-col gap-6">
      <div className="bg-primaryWhite flex-1 rounded-lg">
        <h3>Trending</h3>
        <div>Some stuff</div>
      </div>

      <div className="bg-primaryWhite flex-1 rounded-lg">
        <h3>Friends</h3>
        <div>Some stuff</div>
      </div>
    </section>
  );
}

export default HomeSidebar;
